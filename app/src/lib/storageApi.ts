import { isSupabaseConfigured, supabase } from './supabase';

export type StorageBucket = 'images';
export type ImageFolder = 'members' | 'projects' | 'achievements' | 'board-members';

function assertConfigured() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
}

/**
 * Upload an image file to Supabase Storage
 * @param file - The image file to upload
 * @param folder - The folder within the images bucket (members, projects, achievements, board-members)
 * @param customName - Optional custom filename (auto-generated if not provided)
 * @param subfolder - Optional subfolder (e.g., project-specific folder)
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  folder: ImageFolder,
  customName?: string,
  subfolder?: string
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

  // Build file path with optional subfolder
  const filePath = subfolder
    ? `${folder}/${subfolder}/${filename}`
    : `${folder}/${filename}`;

  console.log('Uploading to path:', filePath);

  // Upload to Supabase Storage
  const { data, error } = await supabase!.storage
    .from('images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false // Don't overwrite existing files
    });

  if (error) {
    console.error('Storage upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  console.log('Upload data:', data);

  // Get public URL
  const { data: { publicUrl } } = supabase!.storage
    .from('images')
    .getPublicUrl(data.path);

  console.log('Public URL:', publicUrl);

  return publicUrl;
}

/**
 * Upload multiple images (e.g., for project galleries)
 * @param files - Array of image files
 * @param folder - The folder within the images bucket
 * @param subfolder - Optional subfolder (e.g., project-specific folder)
 * @returns Array of public URLs
 */
export async function uploadMultipleImages(
  files: File[],
  folder: ImageFolder,
  subfolder?: string
): Promise<string[]> {
  const uploadPromises = files.map(file => uploadImage(file, folder, undefined, subfolder));
  return Promise.all(uploadPromises);
}

/**
 * Generate a project folder name based on title and date
 * @param title - Project title
 * @param date - Completion date (YYYY-MM-DD format)
 * @returns Sanitized folder name
 */
export function generateProjectFolderName(title: string, date: string): string {
  // Extract date in YYYYMMDD format
  const dateStr = date.replace(/-/g, '');
  
  // Sanitize title: lowercase, remove special chars, replace spaces with hyphens
  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 30); // Limit length
  
  return `${dateStr}-${sanitizedTitle}`;
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
