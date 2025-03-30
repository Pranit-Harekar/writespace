
-- Create table for tracking article images
CREATE TABLE IF NOT EXISTS public.article_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  author_id UUID NOT NULL,
  image_path TEXT,
  storage_url TEXT NOT NULL,
  is_uploaded BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.article_images ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own article images
CREATE POLICY "Users can view their own article images"
  ON public.article_images
  FOR SELECT
  USING (auth.uid() = author_id);

-- Allow users to insert their own article images
CREATE POLICY "Users can insert their own article images"
  ON public.article_images
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Allow users to delete their own article images
CREATE POLICY "Users can delete their own article images"
  ON public.article_images
  FOR DELETE
  USING (auth.uid() = author_id);
