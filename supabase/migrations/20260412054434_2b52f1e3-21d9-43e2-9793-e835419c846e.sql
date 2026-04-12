
-- 1. Admin can read all profiles (needed for user management)
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) OR
  public.has_role(auth.uid(), 'super_admin'::app_role) OR
  public.has_role(auth.uid(), 'moderator'::app_role)
);

-- 2. Admin can update matrimony profiles (approval workflow)
CREATE POLICY "Admins can update matrimony profiles"
ON public.matrimony_profiles FOR UPDATE TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) OR
  public.has_role(auth.uid(), 'super_admin'::app_role) OR
  public.has_role(auth.uid(), 'moderator'::app_role)
);

-- 3. Admins can delete non-super roles
CREATE POLICY "Admins can delete non-super roles"
ON public.user_roles FOR DELETE TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) AND role <> 'super_admin'::app_role
);

-- 4. Ensure trust_scores has unique constraint on user_id for upsert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'trust_scores_user_id_key'
  ) THEN
    ALTER TABLE public.trust_scores ADD CONSTRAINT trust_scores_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- 5. Ensure triggers exist on auth.users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_role'
  ) THEN
    CREATE TRIGGER on_auth_user_role
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user_role();
  END IF;
END $$;

-- 6. Ensure matrimony_profiles has unique constraint on user_id for upsert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'matrimony_profiles_user_id_key'
  ) THEN
    ALTER TABLE public.matrimony_profiles ADD CONSTRAINT matrimony_profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- 7. Ensure partner_preferences has unique constraint on user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'partner_preferences_user_id_key'
  ) THEN
    ALTER TABLE public.partner_preferences ADD CONSTRAINT partner_preferences_user_id_key UNIQUE (user_id);
  END IF;
END $$;
