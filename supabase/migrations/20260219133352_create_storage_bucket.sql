/*
  # Create Storage Bucket for Medical Files

  1. New Storage Bucket
    - `medical-files` bucket for storing patient documents
    
  2. Storage Policies
    - Allow authenticated users to upload files to their own folder
    - Allow authenticated users to read files from their own folder
    - Allow authenticated users to delete files from their own folder
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-files', 'medical-files', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'medical-files' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'medical-files' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'medical-files' AND (storage.foldername(name))[1] = auth.uid()::text);