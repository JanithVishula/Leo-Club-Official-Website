import { isSupabaseConfigured, supabase } from './supabase';

export type StorageBucket = 'images';
export type ImageFolder = 'members' | 'projects' | 'achievements';

function assertConfigured() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
}

/**
 * Upload an image file to Supabase Storage
 * @param file - The image file to upload
 * @param folder - The folder within the images bucket (members, projects, achievements)
 * @param customName - Optional custom filename (auto-generated if not provided)
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  folder: ImageFolder,
  customName?: string
): Promise<string> {
  assertConfigured();

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('Image must be smaller than 5MB');
  }

  // Generate unique filename if not provided
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop() || 'jpg';
  const filename = customName 
    ? `${customName}.${extension}`
    : `${timestamp}-${randomStr}.${extension}`;

  const filePath = `${folder}/${filename}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase!.storage
    .from('images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false // Don't overwrite existing files
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase!.storage
    .from('images')
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Upload multiple images (e.g., for project galleries)
 * @param files - Array of image files
 * @param folder - The folder within the images bucket
 * @returns Array of public URLs
 */
export async function uploadMultipleImages(
  files: File[],
  folder: ImageFolder
): Promise<string[]> {
  const uploadPromises = files.map(file => uploadImage(file, folder));
  return Promise.all(uploadPromises);
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - Full public URL of the image
 * @returns True if deleted successfully
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
  assertConfigured();

  try {
    // Extract path from URL
    // URL format: https://xxx.supabase.co/storage/v1/object/public/images/folder/filename.jpg
    const urlPattern = /\/storage\/v1\/object\/public\/images\/(.+)$/;
    const match = imageUrl.match(urlPattern);
    
    if (!match) {
      console.warn('Invalid Supabase Storage URL format:', imageUrl);
      return false;
    }

    const filePath = match[1];

    const { error } = await supabase!.storage
      .from('images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete image:', error);
    return false;
  }
}

/**
 * Check if a URL is a Supabase Storage URL (vs static public folder)
 */
export function isStorageUrl(url: string): boolean {
  return url.includes('/storage/v1/object/public/');
}

/**
 * Get the bucket URL for direct access
 */
export function getStorageBucketUrl(): string | null {
  if (!isSupabaseConfigured || !supabase) return null;
  
  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl('');
  
  return publicUrl.replace(/\/$/, ''); // Remove trailing slash
}
