
CREATE TABLE IF NOT EXISTS public.temple_visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  temple_id INTEGER REFERENCES public.temples(id),
  temple_name_tamil TEXT NOT NULL,
  visited_date DATE DEFAULT CURRENT_DATE,
  visit_notes TEXT,
  rating INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, temple_id)
);

CREATE TABLE IF NOT EXISTS public.temple_wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  temple_id INTEGER REFERENCES public.temples(id),
  temple_name_tamil TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, temple_id)
);

ALTER TABLE public.temple_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temple_wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_visits_select" ON public.temple_visits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_visits_insert" ON public.temple_visits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_visits_update" ON public.temple_visits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own_visits_delete" ON public.temple_visits FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "own_wishlist_select" ON public.temple_wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_wishlist_insert" ON public.temple_wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_wishlist_update" ON public.temple_wishlist FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own_wishlist_delete" ON public.temple_wishlist FOR DELETE USING (auth.uid() = user_id);
