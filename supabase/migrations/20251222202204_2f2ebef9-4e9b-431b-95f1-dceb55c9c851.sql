
-- Update the handle_new_user function to make the first user an admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    user_count integer;
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
    
    -- Check if this is the first user
    SELECT COUNT(*) INTO user_count FROM public.user_roles;
    
    IF user_count = 0 THEN
        -- First user gets admin role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (new.id, 'admin');
    ELSE
        -- Other users get author role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (new.id, 'author');
    END IF;
    
    RETURN new;
END;
$$;
