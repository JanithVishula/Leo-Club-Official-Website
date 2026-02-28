import { createClient } from '@supabase/supabase-js';
import { readdir, readFile, writeFile, stat, rm } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = join(__dirname, '../.env');
let supabaseUrl = '';
let supabaseServiceKey = '';

try {
  const envContent = await readFile(envPath, 'utf-8');
  const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
  const serviceKeyMatch = envContent.match(/VITE_SUPABASE_SERVICE_ROLE_KEY=(.+)/);
  
  if (urlMatch) supabaseUrl = urlMatch[1].trim();
  if (serviceKeyMatch) supabaseServiceKey = serviceKeyMatch[1].trim();
} catch (error) {
  console.error('⚠️  Could not read .env file.');
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌ Missing Supabase credentials!\n');
  console.log('This migration requires the SERVICE_ROLE_KEY to bypass RLS policies.');
  console.log('\n📝 Setup Instructions:');
  console.log('1. Go to Supabase Dashboard → Settings → API');
  console.log('2. Copy the "service_role" key (NOT the anon key)');
  console.log('3. Add to .env file: VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  console.log('\n⚠️  SECURITY WARNING:');
  console.log('   - Service role key bypasses ALL security rules');
  console.log('   - NEVER commit it to Git or deploy it to frontend');
  console.log('   - Remove it from .env after migration is complete');
  console.log('   - Only use it for this one-time migration\n');
  process.exit(1);
}

// Initialize Supabase with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configuration
const publicDir = join(__dirname, '../public');
const migrationLog = {
  members: [],
  projects: [],
  achievements: [],
  errors: [],
  skipped: []
};

// Files to keep in /public/ (won't migrate)
const KEEP_IN_PUBLIC = [
  'wide-impact.jpg',
  'feature-1.jpg',
  'feature-2.jpg',
  'project-1.jpg',
  'project-2.jpg',
  'project-3.jpg',
  'gallery-1.jpg',
  'gallery-2.jpg',
  'gallery-3.jpg',
  'gallery-4.jpg',
  'gallery-5.jpg',
  '.gitkeep'
];

// Helper: Upload file to Supabase Storage
async function uploadToStorage(filePath, storagePath, folder) {
  try {
    const fileBuffer = await readFile(filePath);
    const fileName = basename(filePath);
    const fullPath = `${folder}/${storagePath}`;

    console.log(`  📤 Uploading ${fileName} → ${fullPath}`);

    const { data, error } = await supabase.storage
      .from('images')
      .upload(fullPath, fileBuffer, {
        contentType: getMimeType(fileName),
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);

    return { success: true, url: publicUrl, path: data.path };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Helper: Get MIME type from file extension
function getMimeType(filename) {
  const ext = extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Helper: Check if file is an image
function isImageFile(filename) {
  const ext = extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
}

// Helper: Sanitize filename for storage
function sanitizeFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9.-]/g, '');
}

// Migrate member images (*.jpg in root /public/)
async function migrateMemberImages() {
  console.log('\n👥 Migrating Member Images...');
  
  const files = await readdir(publicDir);
  
  for (const file of files) {
    if (KEEP_IN_PUBLIC.includes(file)) {
      migrationLog.skipped.push({ file, reason: 'Static asset (keep in /public/)' });
      continue;
    }

    const filePath = join(publicDir, file);
    const stats = await stat(filePath);

    if (stats.isFile() && isImageFile(file)) {
      const sanitized = sanitizeFilename(file);
      const result = await uploadToStorage(filePath, sanitized, 'members');
      
      if (result.success) {
        migrationLog.members.push({
          original: file,
          uploaded: sanitized,
          url: result.url,
          localPath: filePath
        });
        console.log(`  ✅ ${file} → ${result.url}`);
      } else {
        migrationLog.errors.push({ file, error: result.error });
        console.log(`  ❌ ${file} - ${result.error}`);
      }
    }
  }
}

// Migrate project folders and their images
async function migrateProjectImages() {
  console.log('\n📁 Migrating Project Folders...');
  
  const projectsDir = join(publicDir, 'projects');
  
  try {
    const folders = await readdir(projectsDir);
    
    for (const folder of folders) {
      const folderPath = join(projectsDir, folder);
      const stats = await stat(folderPath);
      
      if (!stats.isDirectory()) continue;
      
      console.log(`\n  📂 Processing: ${folder}`);
      const folderSanitized = sanitizeFilename(folder);
      
      const images = await readdir(folderPath);
      const projectImages = [];
      
      for (const image of images) {
        if (!isImageFile(image)) continue;
        
        const imagePath = join(folderPath, image);
        const imageSanitized = sanitizeFilename(image);
        const storagePath = `${folderSanitized}/${imageSanitized}`;
        
        const result = await uploadToStorage(imagePath, storagePath, 'projects');
        
        if (result.success) {
          projectImages.push({
            original: image,
            uploaded: imageSanitized,
            url: result.url
          });
          console.log(`    ✅ ${image}`);
        } else {
          migrationLog.errors.push({ file: `${folder}/${image}`, error: result.error });
          console.log(`    ❌ ${image} - ${result.error}`);
        }
      }
      
      if (projectImages.length > 0) {
        migrationLog.projects.push({
          folder,
          folderSanitized,
          images: projectImages,
          localPath: folderPath
        });
      }
    }
  } catch (error) {
    console.log(`  ⚠️  Projects folder not found or empty`);
  }
}

// Migrate achievement images
async function migrateAchievementImages() {
  console.log('\n🏆 Migrating Achievement Images...');
  
  const achievementsDir = join(publicDir, 'Achivements images');
  
  try {
    const files = await readdir(achievementsDir);
    
    for (const file of files) {
      if (!isImageFile(file)) continue;
      
      const filePath = join(achievementsDir, file);
      const sanitized = sanitizeFilename(file);
      
      const result = await uploadToStorage(filePath, sanitized, 'achievements');
      
      if (result.success) {
        migrationLog.achievements.push({
          original: file,
          uploaded: sanitized,
          url: result.url,
          localPath: filePath
        });
        console.log(`  ✅ ${file} → ${result.url}`);
      } else {
        migrationLog.errors.push({ file, error: result.error });
        console.log(`  ❌ ${file} - ${result.error}`);
      }
    }
  } catch (error) {
    console.log(`  ⚠️  Achievements folder not found or empty`);
  }
}

// Generate migration report
async function generateReport() {
  const reportPath = join(__dirname, 'migration-report.json');
  await writeFile(reportPath, JSON.stringify(migrationLog, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`👥 Member images:       ${migrationLog.members.length} uploaded`);
  console.log(`📁 Project folders:     ${migrationLog.projects.length} folders`);
  
  const totalProjectImages = migrationLog.projects.reduce((sum, p) => sum + p.images.length, 0);
  console.log(`📸 Project images:      ${totalProjectImages} uploaded`);
  console.log(`🏆 Achievement images:  ${migrationLog.achievements.length} uploaded`);
  console.log(`⏭️  Skipped files:       ${migrationLog.skipped.length} (kept in /public/)`);
  console.log(`❌ Errors:              ${migrationLog.errors.length}`);
  console.log('='.repeat(60));
  
  if (migrationLog.errors.length > 0) {
    console.log('\n❌ Errors:');
    migrationLog.errors.forEach(err => {
      console.log(`  - ${err.file}: ${err.error}`);
    });
  }
  
  console.log(`\n📄 Full report saved to: ${reportPath}`);
}

// Clean up old files (with confirmation)
async function cleanupOldFiles() {
  console.log('\n🗑️  Cleanup Options:');
  console.log('Would you like to remove the migrated files from /public/?');
  console.log('(Run this manually after verifying uploads in Supabase Storage)\n');
  
  const cleanupScript = `
// Cleanup script - Run this after verifying uploads
import { rm } from 'fs/promises';

async function cleanup() {
  const report = await import('./migration-report.json', { assert: { type: 'json' } });
  
  // Remove member images
  for (const member of report.default.members) {
    await rm(member.localPath);
    console.log('Deleted:', member.localPath);
  }
  
  // Remove project folders
  for (const project of report.default.projects) {
    await rm(project.localPath, { recursive: true });
    console.log('Deleted:', project.localPath);
  }
  
  // Remove achievement images
  for (const achievement of report.default.achievements) {
    await rm(achievement.localPath);
    console.log('Deleted:', achievement.localPath);
  }
  
  console.log('✅ Cleanup complete!');
}

cleanup();
`;

  await writeFile(join(__dirname, 'cleanup.mjs'), cleanupScript);
  console.log('📝 Cleanup script created: scripts/cleanup.mjs');
  console.log('   Run with: node scripts/cleanup.mjs');
}

// Main migration function
async function migrate() {
  console.log('🚀 Starting Image Migration to Supabase Storage...');
  console.log('='.repeat(60));
  
  try {
    await migrateMemberImages();
    await migrateProjectImages();
    await migrateAchievementImages();
    await generateReport();
    await cleanupOldFiles();
    
    console.log('\n✅ Migration completed!');
    console.log('\nNext steps:');
    console.log('1. Check Supabase Storage → images/ to verify uploads');
    console.log('2. Review migration-report.json for URLs');
    console.log('3. Update config.ts with new Supabase URLs (if needed)');
    console.log('4. Run cleanup.mjs to remove old files from /public/');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrate();
