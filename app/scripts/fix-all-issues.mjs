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

console.log('🔧 Fixing all issues...\n');

// ISSUE 01: Ensure we have exactly 4 services (to match config.ts and avoid empty box)
console.log('📋 Issue 01: Cleaning up services to match 4-grid...');
const { data: services } = await supabase.from('services').select('*').order('display_order');

if (services && services.length > 4) {
  console.log(`  Found ${services.length} services, keeping only first 4...`);
  const toDelete = services.slice(4).map(s => s.id);
  for (const id of toDelete) {
    await supabase.from('services').delete().eq('id', id);
    console.log(`  ✅ Deleted service ${id}`);
  }
} else {
  console.log(`  ✅ Services count is good (${services.length})`);
}

// ISSUE 02: Delete feature_card 3, keep only 2 cards
console.log('\n🎴 Issue 02: Removing feature card 3...');
const { data: cards } = await supabase.from('feature_cards').select('*').order('display_order');

if (cards && cards.length > 2) {
  console.log(`  Found ${cards.length} feature cards, keeping only first 2...`);
  const toDelete = cards.slice(2).map(c => c.id);
  for (const id of toDelete) {
    await supabase.from('feature_cards').delete().eq('id', id);
    console.log(`  ✅ Deleted feature card ${id}`);
  }
} else {
  console.log(`  ✅ Feature cards count is good (${cards.length})`);
}

// ISSUE 04: Verify project images
console.log('\n🖼️  Issue 04: Checking project data...');
const { data: projects } = await supabase.from('projects').select('*');
console.log(`  Current projects in DB: ${projects?.length || 0}`);
if (projects && projects.length > 0) {
  projects.forEach(p => {
    console.log(`    - ${p.title}: ${p.image_url ? '✅ Has image' : '❌ NO IMAGE'}`);
  });
}

console.log('\n✅ All database fixes applied!');
console.log('\nℹ️  For Issue 04: If you have project image URLs, I can add them to config.ts');
