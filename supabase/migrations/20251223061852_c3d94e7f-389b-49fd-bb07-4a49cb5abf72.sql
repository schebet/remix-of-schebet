-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true);

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload article images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'article-images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Authenticated users can update article images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'article-images');

-- Allow authenticated users to delete article images
CREATE POLICY "Authenticated users can delete article images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'article-images');

-- Allow public read access to article images
CREATE POLICY "Public can view article images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'article-images');