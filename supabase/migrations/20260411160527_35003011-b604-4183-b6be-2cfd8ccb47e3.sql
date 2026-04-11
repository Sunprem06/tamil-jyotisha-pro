
-- Permissions table
CREATE TABLE public.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  category text NOT NULL DEFAULT 'general',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view permissions" ON public.permissions FOR SELECT TO authenticated USING (true);

-- Seed default permissions
INSERT INTO public.permissions (name, description, category) VALUES
  ('users.create', 'Create new users', 'users'),
  ('users.read', 'View user details', 'users'),
  ('users.update', 'Edit user details', 'users'),
  ('users.delete', 'Delete users', 'users'),
  ('users.suspend', 'Suspend users', 'users'),
  ('users.ban', 'Ban users', 'users'),
  ('users.change_role', 'Change user roles', 'users'),
  ('profiles.approve', 'Approve profiles', 'moderation'),
  ('profiles.reject', 'Reject profiles', 'moderation'),
  ('profiles.moderate', 'Moderate flagged profiles', 'moderation'),
  ('payments.read', 'View payment data', 'payments'),
  ('payments.refund', 'Process refunds', 'payments'),
  ('analytics.read', 'View analytics', 'analytics'),
  ('config.read', 'View system configuration', 'config'),
  ('config.update', 'Update system configuration', 'config'),
  ('fraud.read', 'View fraud detection data', 'fraud'),
  ('fraud.action', 'Take action on fraud cases', 'fraud'),
  ('audit.read', 'View audit logs', 'audit'),
  ('export.data', 'Export data', 'export'),
  ('sensitive.view', 'View sensitive user data', 'sensitive');

-- Role-Permission mapping
CREATE TABLE public.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role public.app_role NOT NULL,
  permission_id uuid NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(role, permission_id)
);
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view role permissions" ON public.role_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admins can manage role permissions" ON public.role_permissions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

-- Seed role permissions
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'super_admin', id FROM public.permissions;

INSERT INTO public.role_permissions (role, permission_id)
SELECT 'admin', id FROM public.permissions WHERE name NOT IN ('config.update', 'users.delete');

INSERT INTO public.role_permissions (role, permission_id)
SELECT 'moderator', id FROM public.permissions WHERE name IN ('users.read', 'profiles.approve', 'profiles.reject', 'profiles.moderate', 'fraud.read');

INSERT INTO public.role_permissions (role, permission_id)
SELECT 'support_agent', id FROM public.permissions WHERE name IN ('users.read', 'users.update', 'profiles.moderate');

INSERT INTO public.role_permissions (role, permission_id)
SELECT 'analyst', id FROM public.permissions WHERE name IN ('analytics.read', 'payments.read', 'export.data');

-- System Configurations
CREATE TABLE public.system_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  category text NOT NULL DEFAULT 'general',
  description text,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.system_configurations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read configs" ON public.system_configurations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can update configs" ON public.system_configurations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert configs" ON public.system_configurations FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

INSERT INTO public.system_configurations (key, value, category, description) VALUES
  ('subscription_pricing', '{"basic_monthly": 299, "premium_monthly": 799, "premium_yearly": 7999, "currency": "INR"}', 'monetization', 'Subscription plan pricing'),
  ('credit_costs', '{"contact_unlock": 50, "priority_listing": 100, "horoscope_report": 30}', 'monetization', 'Credit costs for features'),
  ('contact_unlock_rules', '{"require_paid": true, "require_consent": true, "daily_limit": 10, "cooldown_hours": 24}', 'monetization', 'Contact unlock rules'),
  ('free_vs_premium', '{"free_matches_per_day": 5, "free_chart_saves": 3, "premium_matches_per_day": 50, "premium_chart_saves": -1}', 'monetization', 'Free vs premium limits'),
  ('matching_weights', '{"star_compatibility": 30, "dosha_check": 20, "dasha_alignment": 15, "education": 10, "location": 10, "age": 15}', 'matching', 'Matching algorithm weights'),
  ('dosha_sensitivity', '{"mangal_strict": true, "kaal_sarp_check": true, "nadi_check": true, "severity_threshold": 3}', 'astrology', 'Dosha detection sensitivity'),
  ('fraud_thresholds', '{"max_accounts_per_ip": 3, "min_profile_age_hours": 1, "rapid_message_limit": 50, "trust_score_block": 20}', 'fraud', 'Fraud detection thresholds'),
  ('notification_settings', '{"email_match_alerts": true, "sms_verification": true, "push_new_matches": true}', 'notifications', 'Notification preferences');

-- Audit Logs
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated can insert audit logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Fraud Logs
CREATE TABLE public.fraud_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  signal_type text NOT NULL,
  severity text NOT NULL DEFAULT 'low',
  details jsonb DEFAULT '{}'::jsonb,
  resolved boolean NOT NULL DEFAULT false,
  resolved_by uuid,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.fraud_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view fraud logs" ON public.fraud_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));
CREATE POLICY "System can insert fraud logs" ON public.fraud_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update fraud logs" ON public.fraud_logs FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

-- Trust Scores
CREATE TABLE public.trust_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  score integer NOT NULL DEFAULT 50,
  profile_completeness integer NOT NULL DEFAULT 0,
  verification_level integer NOT NULL DEFAULT 0,
  behavior_score integer NOT NULL DEFAULT 50,
  report_count integer NOT NULL DEFAULT 0,
  payment_history_score integer NOT NULL DEFAULT 0,
  activity_quality integer NOT NULL DEFAULT 50,
  last_calculated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.trust_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own trust score" ON public.trust_scores FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all trust scores" ON public.trust_scores FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage trust scores" ON public.trust_scores FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own trust score" ON public.trust_scores FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Matrimony Profiles
CREATE TABLE public.matrimony_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  gender text NOT NULL,
  date_of_birth date NOT NULL,
  height_cm integer,
  weight_kg integer,
  complexion text,
  body_type text,
  marital_status text NOT NULL DEFAULT 'never_married',
  mother_tongue text NOT NULL DEFAULT 'Tamil',
  religion text NOT NULL DEFAULT 'Hindu',
  caste text,
  sub_caste text,
  gothram text,
  education text,
  education_detail text,
  occupation text,
  occupation_detail text,
  annual_income text,
  company_name text,
  city text,
  state text,
  country text NOT NULL DEFAULT 'India',
  about_me text,
  family_type text,
  family_status text,
  father_occupation text,
  mother_occupation text,
  siblings_count integer DEFAULT 0,
  horoscope_id uuid,
  photos text[] DEFAULT '{}',
  profile_status text NOT NULL DEFAULT 'pending',
  is_verified boolean NOT NULL DEFAULT false,
  is_premium boolean NOT NULL DEFAULT false,
  visibility text NOT NULL DEFAULT 'public',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.matrimony_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view public profiles" ON public.matrimony_profiles FOR SELECT TO authenticated USING (visibility = 'public' OR auth.uid() = user_id);
CREATE POLICY "Users can manage own profile" ON public.matrimony_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.matrimony_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own profile" ON public.matrimony_profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.matrimony_profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'moderator'));

-- Partner Preferences
CREATE TABLE public.partner_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  age_min integer DEFAULT 18,
  age_max integer DEFAULT 45,
  height_min integer,
  height_max integer,
  marital_status text[] DEFAULT ARRAY['never_married'],
  education text[],
  occupation text[],
  annual_income_min text,
  caste text[],
  city text[],
  state text[],
  country text[] DEFAULT ARRAY['India'],
  mother_tongue text[] DEFAULT ARRAY['Tamil'],
  star_compatibility_required boolean DEFAULT true,
  dosha_check_required boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.partner_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own preferences" ON public.partner_preferences FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Subscriptions
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_name text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  stripe_subscription_id text,
  stripe_customer_id text,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  interval text NOT NULL DEFAULT 'monthly',
  current_period_start timestamptz,
  current_period_end timestamptz,
  canceled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins can manage subscriptions" ON public.subscriptions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users can insert own subscription" ON public.subscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Credits
CREATE TABLE public.credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  balance integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own credits" ON public.credits FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own credits" ON public.credits FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage credits" ON public.credits FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

-- Credit Transactions
CREATE TABLE public.credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount integer NOT NULL,
  type text NOT NULL,
  description text,
  reference_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.credit_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "System can insert transactions" ON public.credit_transactions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can view all transactions" ON public.credit_transactions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Contact Unlocks
CREATE TABLE public.contact_unlocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL,
  target_id uuid NOT NULL,
  credits_spent integer NOT NULL DEFAULT 0,
  consent_given boolean NOT NULL DEFAULT false,
  admin_override boolean NOT NULL DEFAULT false,
  revoked boolean NOT NULL DEFAULT false,
  revoked_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_unlocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own unlocks" ON public.contact_unlocks FOR SELECT TO authenticated USING (auth.uid() = requester_id OR auth.uid() = target_id);
CREATE POLICY "Users can create unlocks" ON public.contact_unlocks FOR INSERT TO authenticated WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Admins can manage unlocks" ON public.contact_unlocks FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Reports
CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL,
  reported_user_id uuid NOT NULL,
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'pending',
  resolved_by uuid,
  resolution_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can create reports" ON public.reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can view own reports" ON public.reports FOR SELECT TO authenticated USING (auth.uid() = reporter_id);
CREATE POLICY "Admins can manage reports" ON public.reports FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'moderator'));

-- Messages
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  content text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can mark messages read" ON public.messages FOR UPDATE TO authenticated USING (auth.uid() = receiver_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Triggers
CREATE TRIGGER update_system_configurations_updated_at BEFORE UPDATE ON public.system_configurations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_trust_scores_updated_at BEFORE UPDATE ON public.trust_scores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_matrimony_profiles_updated_at BEFORE UPDATE ON public.matrimony_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_partner_preferences_updated_at BEFORE UPDATE ON public.partner_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_credits_updated_at BEFORE UPDATE ON public.credits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Permission check function
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.role_permissions rp
    JOIN public.user_roles ur ON ur.role = rp.role
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = _user_id AND p.name = _permission
  )
$$;
