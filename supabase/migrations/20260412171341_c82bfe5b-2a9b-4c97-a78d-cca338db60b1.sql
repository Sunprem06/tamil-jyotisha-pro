
-- Add new values to spiritual_update_type enum
ALTER TYPE public.spiritual_update_type ADD VALUE IF NOT EXISTS 'weekly_palan';
ALTER TYPE public.spiritual_update_type ADD VALUE IF NOT EXISTS 'monthly_palan';
ALTER TYPE public.spiritual_update_type ADD VALUE IF NOT EXISTS 'yearly_palan';
