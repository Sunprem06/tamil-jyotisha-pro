
-- Create category enum for spiritual updates
CREATE TYPE public.spiritual_category AS ENUM ('general', 'money', 'family', 'health', 'spiritual');

-- Create update type enum
CREATE TYPE public.spiritual_update_type AS ENUM ('guidance', 'do_this', 'avoid_this');

-- Create spiritual_updates table
CREATE TABLE public.spiritual_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action TEXT NOT NULL,
  benefit TEXT NOT NULL,
  category spiritual_category NOT NULL DEFAULT 'general',
  update_type spiritual_update_type NOT NULL DEFAULT 'guidance',
  language TEXT NOT NULL DEFAULT 'Tamil',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.spiritual_updates ENABLE ROW LEVEL SECURITY;

-- Everyone can read active updates
CREATE POLICY "Anyone can view active spiritual updates"
ON public.spiritual_updates
FOR SELECT
USING (is_active = true);

-- Admins can view all (including inactive)
CREATE POLICY "Admins can view all spiritual updates"
ON public.spiritual_updates
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Admins can insert
CREATE POLICY "Admins can create spiritual updates"
ON public.spiritual_updates
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Admins can update
CREATE POLICY "Admins can update spiritual updates"
ON public.spiritual_updates
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Admins can delete
CREATE POLICY "Admins can delete spiritual updates"
ON public.spiritual_updates
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Updated_at trigger
CREATE TRIGGER update_spiritual_updates_updated_at
BEFORE UPDATE ON public.spiritual_updates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
