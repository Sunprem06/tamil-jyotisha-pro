
-- MASTER DEITY TABLE
CREATE TABLE IF NOT EXISTS public.deities (
  id SERIAL PRIMARY KEY,
  name_tamil TEXT NOT NULL,
  name_english TEXT NOT NULL,
  name_sanskrit TEXT,
  deity_type TEXT NOT NULL,
  tradition TEXT NOT NULL,
  vahana_tamil TEXT,
  vahana_english TEXT,
  weapon_tamil TEXT,
  consort_tamil TEXT,
  color_association TEXT,
  day_of_week TEXT,
  star_nakshatra TEXT,
  number_association INTEGER,
  flower_offering TEXT,
  fruit_offering TEXT,
  main_mantra TEXT,
  significance TEXT,
  iconography_description TEXT,
  search_keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- UNIVERSAL TEMPLES TABLE
CREATE TABLE IF NOT EXISTS public.temples (
  id SERIAL PRIMARY KEY,
  name_tamil TEXT NOT NULL,
  name_english TEXT NOT NULL,
  deity_id INTEGER REFERENCES public.deities(id),
  deity_name_tamil TEXT NOT NULL,
  deity_name_english TEXT NOT NULL,
  temple_type TEXT NOT NULL,
  location TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Tamil Nadu',
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  address TEXT,
  google_maps_url TEXT,
  phone TEXT,
  timings TEXT DEFAULT '6:00 AM – 12:00 PM, 4:00 PM – 8:30 PM',
  entry_fee TEXT DEFAULT 'Free',
  auspicious_day TEXT,
  auspicious_star TEXT,
  major_festival TEXT,
  festival_month TEXT,
  special_puja TEXT,
  blessing_for TEXT,
  problem_solved TEXT,
  significance TEXT,
  historical_period TEXT,
  built_by TEXT,
  is_arupadai_veedu BOOLEAN DEFAULT FALSE,
  arupadai_number INTEGER,
  is_divya_desam BOOLEAN DEFAULT FALSE,
  divya_desam_number INTEGER,
  is_pancha_bhuta_stala BOOLEAN DEFAULT FALSE,
  is_shakti_peetham BOOLEAN DEFAULT FALSE,
  is_thevaram_paadal BOOLEAN DEFAULT FALSE,
  is_nayanar_related BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STHALA VARALARU TABLE
CREATE TABLE IF NOT EXISTS public.sthala_varalaru (
  id SERIAL PRIMARY KEY,
  temple_id INTEGER REFERENCES public.temples(id),
  temple_name_tamil TEXT NOT NULL,
  story_tamil TEXT NOT NULL,
  story_english TEXT,
  historical_facts TEXT,
  inscriptions TEXT,
  puranic_reference TEXT,
  miracles_recorded TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.deities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sthala_varalaru ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read deities" ON public.deities FOR SELECT USING (TRUE);
CREATE POLICY "Public read temples" ON public.temples FOR SELECT USING (TRUE);
CREATE POLICY "Public read varalaru" ON public.sthala_varalaru FOR SELECT USING (TRUE);

-- Admin write policies for deities
CREATE POLICY "Admins can insert deities" ON public.deities FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins can update deities" ON public.deities FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins can delete deities" ON public.deities FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Admin write policies for temples
CREATE POLICY "Admins can insert temples" ON public.temples FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins can update temples" ON public.temples FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins can delete temples" ON public.temples FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Admin write policies for sthala_varalaru
CREATE POLICY "Admins can insert varalaru" ON public.sthala_varalaru FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins can update varalaru" ON public.sthala_varalaru FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins can delete varalaru" ON public.sthala_varalaru FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
