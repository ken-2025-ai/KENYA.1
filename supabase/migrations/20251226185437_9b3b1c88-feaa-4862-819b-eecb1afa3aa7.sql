-- Create storage bucket for machinery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('machinery-images', 'machinery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for machinery image uploads
CREATE POLICY "Anyone can view machinery images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'machinery-images');

CREATE POLICY "Authenticated users can upload machinery images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'machinery-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own machinery images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'machinery-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own machinery images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'machinery-images' AND auth.uid()::text = (storage.foldername(name))[1]);