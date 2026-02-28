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

console.log('🔍 Checking Services...\n');

const { data: services, error } = await supabase
  .from('services')
  .select('*')
  .eq('is_active', true)
  .order('display_order');

if (error) {
  console.log('❌ Error:', error);
} else {
  console.log(`Found ${services.length} services:`);
  services.forEach((s, i) => {
    console.log(`  ${i + 1}. [Order ${s.display_order}] ${s.title} - Icon: ${s.icon_name}`);
  });
}
