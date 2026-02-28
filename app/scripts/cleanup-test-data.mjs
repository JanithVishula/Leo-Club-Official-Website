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
const serviceKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

console.log('🗑️  Cleaning up test/placeholder data...\n');

// Delete test projects (check01, check02, check 03)
const { data: projects } = await supabase
  .from('projects')
  .select('id, title');

console.log(`Found ${projects?.length || 0} projects in database:`);
projects?.forEach(p => console.log(`  - ${p.title} (${p.id})`));

console.log('\n🧹 Deleting all test projects...');
const { error: deleteError } = await supabase
  .from('projects')
  .delete()
  .neq('id', '00000000-0000-0000-0000-000000000000'); // Match all

if (deleteError) {
  console.log('❌ Error:', deleteError);
} else {
  console.log('✅ All test projects deleted');
}

console.log('\n📊 Verifying deletion...');
const { data: remaining } = await supabase
  .from('projects')
  .select('count');

console.log(`Remaining projects: ${remaining?.[0]?.count || 0}`);
console.log('\n✅ Cleanup complete! Projects will now load only from config.ts');
