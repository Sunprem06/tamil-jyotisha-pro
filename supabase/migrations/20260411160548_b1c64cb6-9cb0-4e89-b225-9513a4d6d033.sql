
-- Fix audit_logs: only allow inserting logs for yourself
DROP POLICY "Authenticated can insert audit logs" ON public.audit_logs;
CREATE POLICY "Users can insert own audit logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Fix fraud_logs: only admins can insert
DROP POLICY "System can insert fraud logs" ON public.fraud_logs;
CREATE POLICY "Admins can insert fraud logs" ON public.fraud_logs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Fix credit_transactions: only user's own or admin
DROP POLICY "System can insert transactions" ON public.credit_transactions;
CREATE POLICY "Users can insert own transactions" ON public.credit_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can insert transactions" ON public.credit_transactions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));
