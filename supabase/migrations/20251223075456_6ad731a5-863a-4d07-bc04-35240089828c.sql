-- Allow admins to delete any article
CREATE POLICY "Admins can delete any article"
ON public.articles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to view all articles (including drafts)
CREATE POLICY "Admins can view all articles"
ON public.articles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to update any article
CREATE POLICY "Admins can update any article"
ON public.articles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));