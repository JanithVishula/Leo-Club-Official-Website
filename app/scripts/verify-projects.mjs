import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env
const envPath = join(__dirname, '../.env');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split(/\r?\n/).forEach(line => {
  if (!line || line.startsWith('#')) return;
  
  const equalIndex = line.indexOf('=');
  if (equalIndex > -1) {
    const key = line.substring(0, equalIndex).trim();
    const value = line.substring(equalIndex + 1).trim();
    envVars[key] = value;
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyProjects() {
  console.log('📊 Verifying projects in database...\n');

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order');

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`✅ Found ${projects.length} projects:\n`);

  projects.forEach((project, index) => {
    const galleryCount = Array.isArray(project.gallery_images) 
      ? project.gallery_images.length 
      : 0;
    
    console.log(`${index + 1}. ${project.title}`);
    console.log(`   📅 Date: ${project.date_text}`);
    console.log(`   🏷️  Category: ${project.category}`);
    console.log(`   🖼️  Main Image: ${project.image_url.substring(0, 80)}...`);
    console.log(`   🎨 Gallery Images: ${galleryCount}`);
    
    if (galleryCount > 0 && galleryCount <= 3) {
      console.log(`   📷 Gallery URLs:`);
      project.gallery_images.forEach((url, i) => {
        console.log(`      ${i + 1}. ${url.substring(0, 70)}...`);
      });
    } else if (galleryCount > 3) {
      console.log(`   📷 First 3 gallery URLs:`);
      project.gallery_images.slice(0, 3).forEach((url, i) => {
        console.log(`      ${i + 1}. ${url.substring(0, 70)}...`);
      });
      console.log(`      ... and ${galleryCount - 3} more`);
    }
    
    console.log(`   ⭐ Featured: ${project.is_featured ? 'Yes' : 'No'}`);
    console.log('');
  });
}

verifyProjects();
