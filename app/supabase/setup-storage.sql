-- =====================================================
-- Supabase Storage Setup Script
-- =====================================================
-- Run this AFTER running schema.sql
-- This creates the storage bucket and folders programmatically
-- =====================================================

-- NOTE: Folder creation in Supabase Storage doesn't require SQL.
-- Folders are created automatically when you upload files to paths like:
--   - images/projects/filename.jpg
--   - images/members/filename.jpg
--   - images/achievements/filename.jpg

-- The storage bucket is already created by schema.sql
-- This file is for reference and manual verification

-- =====================================================
-- VERIFY STORAGE BUCKET EXISTS
-- =====================================================

-- Check if images bucket exists
select * from storage.buckets where id = 'images';

-- Expected result:
-- id: images
-- name: images
-- public: true
-- file_size_limit: 5242880 (5MB)
-- allowed_mime_types: {image/jpeg, image/jpg, image/png, image/webp, image/gif}

-- =====================================================
-- VERIFY STORAGE POLICIES
-- =====================================================

-- Check storage policies
select 
  schemaname,
  tablename,
  policyname,
  roles,
  cmd
from pg_policies 
where tablename = 'objects' 
and schemaname = 'storage'
order by policyname;

-- Expected policies:
-- 1. Public can view images (SELECT)
-- 2. Admin can upload images (INSERT)
-- 3. Admin can update images (UPDATE)
-- 4. Admin can delete images (DELETE)

-- =====================================================
-- MANUAL FOLDER CREATION (OPTIONAL)
-- =====================================================

-- Folders in Supabase Storage are virtual and created automatically
-- when you upload files to a path. However, you can create empty
-- "folder markers" by uploading a tiny placeholder file:

-- Option 1: Upload via Dashboard
-- - Go to Storage → images
-- - Click "Upload file"
-- - Create folders: members/, projects/, achievements/

-- Option 2: Upload via Code
-- The admin dashboard will create folders automatically when
-- uploading the first image to each category

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

-- If bucket doesn't exist, run:
-- insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- values (
--   'images',
--   'images',
--   true,
--   5242880,
--   array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
-- );

-- If policies are missing, check schema.sql and re-run the storage policies section
