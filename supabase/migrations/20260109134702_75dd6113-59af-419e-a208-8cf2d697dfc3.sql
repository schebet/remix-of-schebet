-- Add og_image column to articles table for storing generated OG images
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS og_image TEXT;