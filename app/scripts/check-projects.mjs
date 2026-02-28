import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env', 'utf-8');
const envLines = envContent.split('\n');
const env = {};
envLines.forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      env[key] = value;
    }
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Checking Projects...\n');

const { data: projects, error } = await supabase
  .from('projects')
  .select('*')
  .order('display_order');

if (error) {
  console.log('❌ Error:', error);
} else {
  console.log(`Found ${projects.length} projects:\n`);
  projects.forEach((p, i) => {
    console.log(`${i + 1}. ${p.title}`);
    console.log(`   Featured: ${p.is_featured ? '✅' : '❌'}`);
    console.log(`   Image: ${p.image_url ? '✅ ' + p.image_url.substring(0, 80) : '❌ NO IMAGE'}`);
    console.log(`   Gallery: ${p.gallery_images ? p.gallery_images.length + ' images' : 'None'}`);
    console.log('');
  });
}
