
-- Create a function to auto-assign super_admin to specific email
CREATE OR REPLACE FUNCTION public.handle_super_admin_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.email = 'premchandar.mhtsl@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'super_admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Update profile with phone
    UPDATE public.profiles 
    SET phone = '9940342155', display_name = 'Premchandar (Super Admin)'
    WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger (runs AFTER the default handle_new_user triggers)
CREATE TRIGGER assign_super_admin_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_super_admin_assignment();
