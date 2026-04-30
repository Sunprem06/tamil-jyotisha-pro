-- ============ match_runs (history snapshot) ============
CREATE TABLE IF NOT EXISTS public.match_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  status text NOT NULL DEFAULT 'running', -- running | success | failed
  error_message text,
  inputs_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb, -- profile + prefs at run time
  results_summary jsonb NOT NULL DEFAULT '{}'::jsonb, -- counts, top-N candidate ids+scores
  total_candidates int NOT NULL DEFAULT 0,
  matches_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_match_runs_user_started ON public.match_runs(user_id, started_at DESC);

ALTER TABLE public.match_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own match runs" ON public.match_runs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users insert own match runs" ON public.match_runs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own match runs" ON public.match_runs
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins manage match runs" ON public.match_runs
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- ============ credit_requests (admin-managed top-ups) ============
CREATE TABLE IF NOT EXISTS public.credit_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  requested_credits int NOT NULL CHECK (requested_credits > 0),
  amount_inr numeric(10,2) NOT NULL CHECK (amount_inr >= 0),
  payment_method text NOT NULL DEFAULT 'upi', -- upi | bank | cash | other
  payment_reference text, -- UPI ref / txn id provided by user
  user_note text,
  status text NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  admin_note text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_credit_requests_user ON public.credit_requests(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_requests_status ON public.credit_requests(status, created_at DESC);

ALTER TABLE public.credit_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own credit requests" ON public.credit_requests
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users insert own credit requests" ON public.credit_requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage credit requests" ON public.credit_requests
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_credit_requests_updated
  BEFORE UPDATE ON public.credit_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed a config key for credit pack pricing (admin-tunable)
INSERT INTO public.system_configurations (key, value, category, description)
VALUES
  ('matrimony.credit_packs',
   '[{"credits":50,"price_inr":99},{"credits":150,"price_inr":249},{"credits":500,"price_inr":699}]'::jsonb,
   'matrimony',
   'Available credit packs users can request to purchase')
ON CONFLICT (key) DO NOTHING;