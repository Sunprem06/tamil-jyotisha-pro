
-- Lock down user_roles: only super_admin can INSERT/UPDATE/DELETE
CREATE POLICY "Super admins can manage user roles"
ON public.user_roles FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

-- Also allow admin to manage (but not super_admin role)
CREATE POLICY "Admins can manage non-super roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  AND role != 'super_admin'::app_role
);

-- Remove dangerous self-insert policies
DROP POLICY IF EXISTS "Users can insert own trust score" ON public.trust_scores;
DROP POLICY IF EXISTS "Users can insert own credits" ON public.credits;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.credit_transactions;

-- Restrict system_configurations to admins only
DROP POLICY IF EXISTS "Authenticated can read configs" ON public.system_configurations;
CREATE POLICY "Admins can read configs"
ON public.system_configurations FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'super_admin'::app_role)
  OR has_role(auth.uid(), 'admin'::app_role)
);
