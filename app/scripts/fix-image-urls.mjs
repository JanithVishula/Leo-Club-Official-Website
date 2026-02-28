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

console.log('🔧 Fixing Image References...\n');

// 1. Fix portfolio images - use gallery-1 to gallery-5, plus add wide-impact.jpg
console.log('📸 Updating portfolio_images...');
const portfolioUpdates = [
  { display_order: 1, image_url: '/gallery-1.jpg', image_alt: 'Community Service Project' },
  { display_order: 2, image_url: '/gallery-2.jpg', image_alt: 'Youth Leadership Workshop' },
  { display_order: 3, image_url: '/gallery-3.jpg', image_alt: 'Environmental Initiative' },
  { display_order: 4, image_url: '/gallery-4.jpg', image_alt: 'Charity Event' },
  { display_order: 5, image_url: '/gallery-5.jpg', image_alt: 'Team Building Activity' },
  { display_order: 6, image_url: '/wide-impact.jpg', image_alt: 'Leo Club Community Impact' },
];

for (const update of portfolioUpdates) {
  const { error } = await supabase
    .from('portfolio_images')
    .update({
      image_url: update.image_url,
      image_alt: update.image_alt
    })
    .eq('display_order', update.display_order);
  
  if (error) {
    console.log(`  ❌ Failed to update image ${update.display_order}:`, error.message);
  } else {
    console.log(`  ✅ Updated image ${update.display_order}: ${update.image_url}`);
  }
}

// 2. Fix feature card 3 - set to null or use existing image
console.log('\n🎴 Fixing feature card 3 image...');
const { error: featureError } = await supabase
  .from('feature_cards')
  .update({ image_url: '/feature-1.jpg' }) // Reuse feature-1 or set to null
  .eq('display_order', 3);

if (featureError) {
  console.log('  ❌ Failed:', featureError.message);
} else {
  console.log('  ✅ Fixed feature card 3 image');
}

// 3. Insert stats into site_settings
console.log('\n📊 Adding stats to site_settings...');
const statsData = [
  { value: 150, suffix: '+', label: 'Community Projects' },
  { value: 50, suffix: '+', label: 'Active Members' },
  { value: 10000, suffix: '+', label: 'Lives Impacted' }
];

const { error: statsError } = await supabase
  .from('site_settings')
  .upsert({
    key: 'stats',
    value: JSON.stringify(statsData),
    description: 'Statistics for Why Choose Me section'
  });

if (statsError) {
  console.log('  ❌ Failed:', statsError.message);
} else {
  console.log('  ✅ Added stats setting');
}

console.log('\n✅ All fixes applied!');
