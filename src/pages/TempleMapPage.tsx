import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BackButton } from '@/components/BackButton';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const FILTERS = [
  { key: 'all', label: 'அனைத்தும்' },
  { key: 'navagraha', label: 'நவகிரகம்' },
  { key: 'murugan', label: 'ஆறுபடை வீடு' },
  { key: 'jyotirlinga', label: 'ஜோதிர்லிங்கம்' },
  { key: 'unesco', label: 'UNESCO' },
  { key: 'world', label: 'உலக கோவில்' },
];

export default function TempleMapPage() {
  const [filter, setFilter] = useState('all');
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  const { data: temples = [], isLoading } = useQuery({
    queryKey: ['map-temples', filter],
    queryFn: async () => {
      let q = supabase
        .from('temples')
        .select('id,name_tamil,name_english,deity_name_tamil,location,district,state,country,latitude,longitude,google_maps_url,auspicious_day,blessing_for,is_navagraha,is_arupadai_veedu,is_jyotirlinga,is_unesco,temple_type')
        .not('latitude', 'is', 'null')
        .not('longitude', 'is', 'null');
      if (filter === 'navagraha') q = q.eq('is_navagraha', true);
      else if (filter === 'murugan') q = q.eq('is_arupadai_veedu', true);
      else if (filter === 'jyotirlinga') q = q.eq('is_jyotirlinga', true);
      else if (filter === 'world') q = q.neq('country', 'India');
      else if (filter === 'unesco') q = q.eq('is_unesco', true);
      const { data } = await q.limit(300);
      return data ?? [];
    },
  });

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((p) =>
      setUserPos([p.coords.latitude, p.coords.longitude])
    );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-4">
        <BackButton />
        <h1 className="text-2xl font-bold font-tamil text-foreground mt-2">
          கோவில் வரைபடம்
        </h1>
        <p className="text-sm text-muted-foreground mb-3">
          Temple Map — {temples.length} temples with coordinates
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                filter === f.key
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground font-tamil animate-pulse">
            கோவில்கள் ஏற்றுகிறது...
          </p>
        </div>
      ) : (
        <div className="h-[70vh] w-full">
          <MapContainer
            center={[11.0, 78.0]}
            zoom={7}
            className="h-full w-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {userPos && (
              <Marker position={userPos}>
                <Popup>நீங்கள் இருக்கும் இடம்</Popup>
              </Marker>
            )}
            {temples.map((t) =>
              t.latitude && t.longitude ? (
                <Marker key={t.id} position={[t.latitude, t.longitude]}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold font-tamil">{t.name_tamil}</p>
                      <p className="text-gray-600 font-tamil">
                        {t.deity_name_tamil}
                      </p>
                      <p className="text-xs">
                        {t.location}, {t.district}
                      </p>
                      {t.auspicious_day && (
                        <p className="text-xs mt-1">
                          📅 {t.auspicious_day}
                        </p>
                      )}
                      {t.google_maps_url && (
                        <a
                          href={t.google_maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 underline mt-1 block"
                        >
                          திசை பெறுக →
                        </a>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ) : null
            )}
          </MapContainer>
        </div>
      )}

      <div className="container py-4 grid grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-primary">{temples.length}</p>
          <p className="text-xs text-muted-foreground font-tamil">கோவில்கள்</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">
            {new Set(temples.map((t) => t.country)).size}
          </p>
          <p className="text-xs text-muted-foreground font-tamil">நாடுகள்</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">
            {temples.filter((t) => t.is_navagraha).length}
          </p>
          <p className="text-xs text-muted-foreground font-tamil">நவகிரகம்</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">Free</p>
          <p className="text-xs text-muted-foreground">OpenStreetMap</p>
        </div>
      </div>
    </div>
  );
}
