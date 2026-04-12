
CREATE TABLE public.rasi_predictions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rasi_id text NOT NULL,
  rasi_name text NOT NULL,
  prediction_type text NOT NULL DEFAULT 'daily',
  prediction text NOT NULL,
  lucky_number text,
  lucky_color text,
  career text,
  health text,
  love text,
  finance text,
  generated_date date NOT NULL DEFAULT CURRENT_DATE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.rasi_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active predictions"
ON public.rasi_predictions FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Service role can manage predictions"
ON public.rasi_predictions FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE INDEX idx_rasi_predictions_date ON public.rasi_predictions (generated_date, prediction_type, rasi_id);

CREATE TRIGGER update_rasi_predictions_updated_at
BEFORE UPDATE ON public.rasi_predictions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
