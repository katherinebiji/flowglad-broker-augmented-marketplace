-- Create storage bucket for marketplace images
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketplace', 'marketplace', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for marketplace bucket

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'marketplace' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'product-images'
  );

-- Allow public read access to all images
CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'marketplace');

-- Allow users to update their own uploaded images
CREATE POLICY "Users can update their own images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'marketplace' 
    AND auth.role() = 'authenticated'
  );

-- Allow users to delete their own uploaded images
CREATE POLICY "Users can delete their own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'marketplace' 
    AND auth.role() = 'authenticated'
  );
