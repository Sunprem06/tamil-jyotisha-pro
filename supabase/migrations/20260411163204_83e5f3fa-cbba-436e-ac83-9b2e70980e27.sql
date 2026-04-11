
-- Unique constraint for trust_scores upsert
ALTER TABLE public.trust_scores ADD CONSTRAINT trust_scores_user_id_unique UNIQUE (user_id);

-- Storage bucket for matrimony photos
INSERT INTO storage.buckets (id, name, public) VALUES ('matrimony-photos', 'matrimony-photos', true);

CREATE POLICY "Anyone can view matrimony photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'matrimony-photos');

CREATE POLICY "Users can upload own photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'matrimony-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'matrimony-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'matrimony-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Trigger for auto profile creation on signup (role trigger already exists)
CREATE TRIGGER on_auth_user_created_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
