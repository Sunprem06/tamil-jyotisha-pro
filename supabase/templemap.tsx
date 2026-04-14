import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BackButton } from '@/components/BackButton';
import { useState, useEffect } from 'react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ICON_BY_TYPE = {
  'Navagraha Stalam': new L.Icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', iconSize: [25,41], iconAnchor: [12,41], popupAnchor: [1,-34] }),
  default: new L.Icon.Default(),
};

export default function TempleMap() {
  const [filter, setFilter] = useState('all');
  const [userPos, setUserPos] = useState<[number,number] | null>(null);

  const { data: temples = [], isLoading } = useQuery({
    queryKey: ['map-temples', filter],
    queryFn: async () => {
      let q = supabase.from('temples').select('id,name_tamil,name_english,deity_name_tamil,location,district,state,country,latitude,longitude,google_maps_url,auspicious_day,blessing_for,is_navagraha,is_arupadai_veedu,is_jyotirlinga,is_unesco,temple_type').not('latitude','is','null').not('longitude','is','null');
      if (filter === 'navagraha') q = q.eq('is_navagraha', true);
      else if (filter === 'murugan') q = q.eq('is_arupadai_veedu', true);
      else if (filter === 'jyotirlinga') q = q.eq('is_jyotirlinga', true);
      else if (filter === 'world') q = q.neq('country', 'India');
      else if (filter === 'unesco') q = q.eq('is_unesco', true);
      const { data } = await q.limit(300);
      return data ?? [];
    }
  });

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(p => setUserPos([p.coords.latitude, p.coords.longitude]));
  }, []);

  const FILTERS = [
    { key: 'all', label: 'அனைத்தும்' },
    { key: 'navagraha', label: 'நவகிரகம்' },
    { key: 'murugan', label: 'ஆறுபடை வீடு' },
    { key: 'jyotirlinga', label: 'ஜோதிர்லிங்கம்' },
    { key: 'unesco', label: 'UNESCO' },
    { key: 'world', label: 'உலக கோவில்' },
  ];

  return (
    

      

        
        
கோவில் வரைபடம்

        
Temple Map — {temples.length} temples with coordinates


        

          {FILTERS.map(f => (
             setFilter(f.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${filter===f.key ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-600 border-gray-300'}`}>
              {f.label}
            
          ))}
        

      

      {isLoading ? (
        

          
கோவில்கள் ஏற்றுகிறது...


        

      ) : (
        

          
            
            {userPos && (
              
                நீங்கள் இருக்கும் இடம்
              
            )}
            {temples.map(t => (
              t.latitude && t.longitude ? (
                
                  
                    

                      
{t.name_tamil}


                      
{t.deity_name_tamil}


                      
{t.location}, {t.district}


                      {t.auspicious_day && 
📅 {t.auspicious_day}

}
                      {t.google_maps_url && (
                        
                          திசை பெறுக →
                        
                      )}
                    

                  
                
              ) : null
            ))}
          
        

      )}
      

        

          
{temples.length}

          
கோவில்கள்

        

        

          
{new Set(temples.map(t=>t.country)).size}

          
நாடுகள்

        

        

          
{temples.filter(t=>t.is_navagraha).length}

          
நவகிரகம்

        

        

          
Free

          
OpenStreetMap

        

      

    

  );
}

Add route in App.tsx: } />
Add "வரைபடம்" link in navigation pointing to /temple-map.
