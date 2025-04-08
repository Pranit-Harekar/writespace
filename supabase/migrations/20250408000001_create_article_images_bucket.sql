
-- Create storage bucket for article images if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
SELECT 'article-images', 'article-images', true, false
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'article-images'
);

-- Set RLS policy for article images bucket
CREATE POLICY "Allow authenticated users to upload article images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "Allow public access to article images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'article-images');
  
CREATE POLICY "Allow users to delete their uploaded article images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'article-images');
