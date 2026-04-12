import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Deity {
  id: number;
  name_tamil: string;
  name_english: string;
  deity_type: string;
  tradition: string;
  vahana_tamil: string | null;
  vahana_english: string | null;
  weapon_tamil: string | null;
  consort_tamil: string | null;
  color_association: string | null;
  day_of_week: string | null;
  star_nakshatra: string | null;
  flower_offering: string | null;
  fruit_offering: string | null;
  main_mantra: string | null;
  significance: string | null;
  search_keywords: string[] | null;
}

interface Temple {
  id: number;
  name_tamil: string;
  name_english: string;
  deity_id: number | null;
  deity_name_tamil: string;
  deity_name_english: string;
  temple_type: string;
  location: string;
  district: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  timings: string | null;
  entry_fee: string | null;
  auspicious_day: string | null;
  major_festival: string | null;
  festival_month: string | null;
  blessing_for: string | null;
  problem_solved: string | null;
  significance: string | null;
  is_arupadai_veedu: boolean;
  arupadai_number: number | null;
  is_divya_desam: boolean;
  divya_desam_number: number | null;
  is_shakti_peetham: boolean;
  image_url: string | null;
  sthala_varalaru: SthalaVaralaru[];
}

interface SthalaVaralaru {
  id: number;
  temple_id: number | null;
  temple_name_tamil: string;
  story_tamil: string;
  story_english: string | null;
  historical_facts: string | null;
  puranic_reference: string | null;
}

export function useUniversalTempleSearch() {
  const [query, setQuery] = useState("");
  const [deityFilter, setDeityFilter] = useState<string | null>(null);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [deities, setDeities] = useState<Deity[]>([]);
  const [allDeities, setAllDeities] = useState<Deity[]>([]);
  const [loading, setLoading] = useState(false);

  // Load all deities for filter pills
  useEffect(() => {
    supabase.from("deities").select("*").then(({ data }) => {
      if (data) setAllDeities(data as unknown as Deity[]);
    });
  }, []);

  const searchTemples = useCallback(async (q: string, deityName?: string | null) => {
    setLoading(true);
    try {
      let templeQuery = supabase
        .from("temples")
        .select("*, sthala_varalaru(*)");

      if (deityName) {
        templeQuery = templeQuery.ilike("deity_name_tamil", `%${deityName}%`);
      }

      if (q.trim()) {
        templeQuery = templeQuery.or(
          `name_tamil.ilike.%${q}%,name_english.ilike.%${q}%,deity_name_tamil.ilike.%${q}%,deity_name_english.ilike.%${q}%,location.ilike.%${q}%,district.ilike.%${q}%,blessing_for.ilike.%${q}%,problem_solved.ilike.%${q}%`
        );
      }

      const { data: templeData } = await templeQuery.limit(30);
      setTemples((templeData as unknown as Temple[]) || []);

      if (q.trim() && !deityName) {
        const { data: deityData } = await supabase
          .from("deities")
          .select("*")
          .or(`name_tamil.ilike.%${q}%,name_english.ilike.%${q}%`)
          .limit(5);
        setDeities((deityData as unknown as Deity[]) || []);
      } else {
        setDeities([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchTemples(query, deityFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, deityFilter, searchTemples]);

  // Initial load
  useEffect(() => {
    searchTemples("", null);
  }, [searchTemples]);

  return {
    query, setQuery,
    deityFilter, setDeityFilter,
    temples, deities, allDeities,
    loading,
  };
}

export function useTempleDetail(id: string | undefined) {
  const [temple, setTemple] = useState<Temple | null>(null);
  const [nearbyTemples, setNearbyTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from("temples")
      .select("*, sthala_varalaru(*)")
      .eq("id", parseInt(id))
      .single()
      .then(({ data }) => {
        const t = data as unknown as Temple;
        setTemple(t);
        setLoading(false);
        // Fetch nearby temples in same district
        if (t?.district) {
          supabase
            .from("temples")
            .select("*")
            .eq("district", t.district)
            .neq("id", t.id)
            .limit(3)
            .then(({ data: nearby }) => {
              setNearbyTemples((nearby as unknown as Temple[]) || []);
            });
        }
      });
  }, [id]);

  return { temple, nearbyTemples, loading };
}

export function useDeityProfile(deityName: string | undefined) {
  const [deity, setDeity] = useState<Deity | null>(null);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deityName) return;
    const decoded = decodeURIComponent(deityName);
    setLoading(true);

    // Use ilike + search_keywords for flexible matching (handles "Vinayagar" → "Lord Ganesha")
    supabase
      .from("deities")
      .select("*")
      .or(`name_english.ilike.%${decoded}%,name_tamil.ilike.%${decoded}%,search_keywords.cs.{${decoded}}`)
      .limit(1)
      .then(({ data }) => {
        const d = (data && data.length > 0) ? (data[0] as unknown as Deity) : null;
        setDeity(d);
        setLoading(false);
        if (d) {
          supabase
            .from("temples")
            .select("*, sthala_varalaru(*)")
            .or(`deity_name_tamil.ilike.%${d.name_tamil}%,deity_name_english.ilike.%${d.name_english}%,deity_id.eq.${d.id}`)
            .order("is_arupadai_veedu", { ascending: false })
            .order("name_tamil")
            .then(({ data: templeData }) => {
              setTemples((templeData as unknown as Temple[]) || []);
            });
        }
      });
  }, [deityName]);

  return { deity, temples, loading };
}
