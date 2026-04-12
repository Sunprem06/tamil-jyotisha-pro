CREATE TABLE IF NOT EXISTS public.daily_rasi_palan (
  id SERIAL PRIMARY KEY,
  palan_date DATE NOT NULL UNIQUE,
  mesha TEXT, rishabha TEXT, mithuna TEXT, kataka TEXT,
  simha TEXT, kanni TEXT, thulam TEXT, viruchigam TEXT,
  dhanusu TEXT, makaram TEXT, kumbam TEXT, meenam TEXT,
  nalla_neram TEXT, rahu_kalam TEXT, yamagandam TEXT,
  samvatsara_year TEXT, tamil_month TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.daily_rasi_palan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_palan" ON public.daily_rasi_palan FOR SELECT USING (true);

CREATE POLICY "service_manage_palan" ON public.daily_rasi_palan FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role));