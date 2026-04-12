import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const DEITY_FILTERS: Record<string, string> = {
  murugan: "deity_name_tamil.ilike.%முருகன்%,deity_name_english.ilike.%Murugan%,deity_name_english.ilike.%Subramania%,deity_name_english.ilike.%Karthikeya%,deity_name_english.ilike.%Senthil%",
  ganesha: "deity_name_tamil.ilike.%விநாயகர்%,deity_name_english.ilike.%Ganesha%,deity_name_english.ilike.%Vinayagar%,deity_name_english.ilike.%Pillayar%,deity_name_english.ilike.%Ganapati%",
  amman: "deity_name_tamil.ilike.%மாரியம்மன்%,deity_name_tamil.ilike.%அம்மன்%,deity_name_english.ilike.%Mariamman%,deity_name_english.ilike.%Amman%,deity_name_english.ilike.%Kali%,deity_name_english.ilike.%Durga%,deity_name_english.ilike.%Kamakshi%,temple_type.ilike.%Amman%,temple_type.ilike.%Shakti%",
  mariamman: "deity_name_tamil.ilike.%மாரியம்மன்%,deity_name_tamil.ilike.%அம்மன்%,deity_name_english.ilike.%Mariamman%,deity_name_english.ilike.%Amman%,deity_name_english.ilike.%Kali%,deity_name_english.ilike.%Durga%,deity_name_english.ilike.%Kamakshi%,temple_type.ilike.%Amman%,temple_type.ilike.%Shakti%",
  kamakshi: "deity_name_tamil.ilike.%காமாட்சி%,deity_name_english.ilike.%Kamakshi%,deity_name_english.ilike.%Shakti%,deity_name_english.ilike.%Durga%",
  lakshmi: "deity_name_tamil.ilike.%லட்சுமி%,deity_name_english.ilike.%Lakshmi%,deity_name_english.ilike.%Mahalakshmi%",
  saraswathi: "deity_name_tamil.ilike.%சரஸ்வதி%,deity_name_english.ilike.%Saraswathi%,deity_name_english.ilike.%Sarasvati%,deity_name_english.ilike.%Sharadamba%",
  ayyanar: "deity_name_tamil.ilike.%அய்யனார்%,deity_name_english.ilike.%Ayyanar%,deity_name_english.ilike.%Ayyappan%",
  muneeswarar: "deity_name_tamil.ilike.%முனீஸ்வரர்%,deity_name_english.ilike.%Muneeswarar%",
  karuppasamy: "deity_name_tamil.ilike.%கருப்பசாமி%,deity_name_english.ilike.%Karuppasamy%",
  shiva: "temple_type.ilike.%Jyotirlinga%,temple_type.ilike.%Shiva%,temple_type.ilike.%Pancha Bhuta%,deity_name_english.ilike.%Shiva%,deity_name_english.ilike.%Nataraja%,deity_name_english.ilike.%Mahadeva%",
  vishnu: "temple_type.ilike.%Divya Desam%,temple_type.ilike.%Char Dham%,deity_name_english.ilike.%Vishnu%,deity_name_english.ilike.%Perumal%,deity_name_english.ilike.%Krishna%,deity_name_english.ilike.%Venkateswara%,deity_name_english.ilike.%Narayan%",
};

export function useTemplesByDeity(deityKey: string, limit = 100) {
  return useQuery({
    queryKey: ["temples-deity", deityKey],
    queryFn: async () => {
      const filter = DEITY_FILTERS[deityKey.toLowerCase()];
      if (!filter) return [];
      const { data, error } = await supabase
        .from("temples")
        .select("*")
        .or(filter)
        .order("is_arupadai_veedu", { ascending: false })
        .order("is_navagraha", { ascending: false })
        .order("name_tamil")
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!deityKey,
  });
}

export function useNavagrahaTemples() {
  return useQuery({
    queryKey: ["navagraha-temples"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("temples")
        .select("*")
        .eq("is_navagraha", true)
        .order("navagraha_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}
