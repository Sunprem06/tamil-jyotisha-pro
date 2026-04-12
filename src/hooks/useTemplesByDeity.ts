import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const DEITY_QUERIES: Record<string, string> = {
  murugan: "deity_name_tamil.ilike.%முருகன்%,deity_name_english.ilike.%Murugan%,deity_name_english.ilike.%Subramania%",
  ganesha: "deity_name_tamil.ilike.%விநாயகர்%,deity_name_english.ilike.%Ganesha%,deity_name_english.ilike.%Vinayagar%",
  mariamman: "deity_name_tamil.ilike.%மாரியம்மன்%,deity_name_english.ilike.%Mariamman%,deity_name_english.ilike.%Amman%",
  kamakshi: "deity_name_tamil.ilike.%காமாட்சி%,deity_name_english.ilike.%Kamakshi%,deity_name_english.ilike.%Shakti%,deity_name_english.ilike.%Durga%",
  lakshmi: "deity_name_tamil.ilike.%லட்சுமி%,deity_name_english.ilike.%Lakshmi%",
  saraswathi: "deity_name_tamil.ilike.%சரஸ்வதி%,deity_name_english.ilike.%Saraswathi%",
  ayyanar: "deity_name_tamil.ilike.%அய்யனார்%,deity_name_english.ilike.%Ayyanar%",
  muneeswarar: "deity_name_tamil.ilike.%முனீஸ்வரர்%,deity_name_english.ilike.%Muneeswarar%",
  karuppasamy: "deity_name_tamil.ilike.%கருப்பசாமி%,deity_name_english.ilike.%Karuppasamy%",
};

export function useTemplesByDeity(deityKey: string) {
  return useQuery({
    queryKey: ["temples-by-deity", deityKey],
    queryFn: async () => {
      const orClause = DEITY_QUERIES[deityKey.toLowerCase()] || `deity_name_english.ilike.%${deityKey}%`;
      const { data, error } = await supabase
        .from("temples")
        .select("*, sthala_varalaru(*)")
        .or(orClause)
        .order("is_arupadai_veedu", { ascending: false })
        .order("name_tamil");
      if (error) throw error;
      return data ?? [];
    },
  });
}
