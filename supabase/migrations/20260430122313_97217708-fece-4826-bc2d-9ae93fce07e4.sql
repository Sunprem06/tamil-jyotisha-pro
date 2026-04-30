
-- Auto-matches cache
CREATE TABLE public.auto_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL,
  candidate_id uuid NOT NULL,
  porutham_score integer NOT NULL DEFAULT 0,
  porutham_max integer NOT NULL DEFAULT 10,
  porutham_breakdown jsonb NOT NULL DEFAULT '[]'::jsonb,
  preference_match jsonb NOT NULL DEFAULT '{}'::jsonb,
  preference_score integer NOT NULL DEFAULT 0,
  combined_score integer NOT NULL DEFAULT 0,
  is_unlocked boolean NOT NULL DEFAULT false,
  unlock_order integer,
  credits_spent integer NOT NULL DEFAULT 0,
  unlocked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(requester_id, candidate_id)
);

CREATE INDEX idx_auto_matches_requester ON public.auto_matches(requester_id, combined_score DESC);

ALTER TABLE public.auto_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own matches"
  ON public.auto_matches FOR SELECT TO authenticated
  USING (auth.uid() = requester_id);

CREATE POLICY "Users insert own matches"
  ON public.auto_matches FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users update own matches"
  ON public.auto_matches FOR UPDATE TO authenticated
  USING (auth.uid() = requester_id);

CREATE POLICY "Admins manage all matches"
  ON public.auto_matches FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_auto_matches_updated_at
  BEFORE UPDATE ON public.auto_matches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed admin-controlled config
INSERT INTO public.system_configurations (key, value, category, description) VALUES
  ('matrimony.free_matches_count', '3'::jsonb, 'matrimony', 'Free auto-match unlocks per user (lifetime)'),
  ('matrimony.match_unlock_price', '10'::jsonb, 'matrimony', 'Credits required per extra match unlock beyond free quota'),
  ('matrimony.porutham_min_score', '6'::jsonb, 'matrimony', 'Minimum Porutham score (out of 10) for a profile to qualify as a match'),
  ('matrimony.preference_min_match_pct', '40'::jsonb, 'matrimony', 'Minimum preference match percentage to include a candidate'),
  ('matrimony.auto_match_max_candidates', '100'::jsonb, 'matrimony', 'Maximum opposite-gender profiles scanned per auto-match run')
ON CONFLICT (key) DO NOTHING;
