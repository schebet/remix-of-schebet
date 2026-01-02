-- Create categories table for custom categories
CREATE TABLE public.categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    value TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Everyone can view categories
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

-- Only admins can insert categories
CREATE POLICY "Admins can insert categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update categories
CREATE POLICY "Admins can update categories" 
ON public.categories 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete non-default categories
CREATE POLICY "Admins can delete non-default categories" 
ON public.categories 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role) AND is_default = false);

-- Insert default categories
INSERT INTO public.categories (value, label, is_default) VALUES
    ('istorija', 'Istorija', true),
    ('kultura', 'Kultura', true),
    ('ljudi', 'Ljudi', true),
    ('priroda', 'Priroda', true),
    ('gastronomija', 'Gastronomija', true),
    ('arhitektura', 'Arhitektura', true),
    ('tradicija', 'Tradicija', true),
    ('dogadjaji', 'Događaji', true),
    ('turizam', 'Turizam', true),
    ('religija', 'Religija', true),
    ('sport-rekreacija', 'Sport i rekreacija', true),
    ('umetnost', 'Umetnost', true),
    ('privreda', 'Privreda', true),
    ('o-imenu-sela-sebet', 'O imenu sela Šebet', true),
    ('ostalo', 'Ostalo', true);