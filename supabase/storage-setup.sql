-- Spandha Supabase Storage Setup (Simplified)
-- Run this in your Supabase Dashboard SQL Editor.

-- 1. Create/configure 'avatars' and 'nic-documents' buckets
-- Enforces a 500KB (512,000 bytes) file size limit on the database level
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 512000, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('nic-documents', 'nic-documents', true, 512000, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public select for avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow public select for nic-documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public insert for avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow public insert for nic-documents" ON storage.objects;

-- 3. Create policies (allowing public select and insert)
CREATE POLICY "Allow public select for avatars" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'avatars');

CREATE POLICY "Allow public select for nic-documents" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'nic-documents');

CREATE POLICY "Allow public insert for avatars" ON storage.objects
  FOR INSERT TO public WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Allow public insert for nic-documents" ON storage.objects
  FOR INSERT TO public WITH CHECK (bucket_id = 'nic-documents');
