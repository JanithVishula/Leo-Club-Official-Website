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
      const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
      env[key] = value;
    }
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Found' : 'NOT FOUND');

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Checking Image URLs in Database...\n');

// Check portfolio images
const { data: portfolioImages, error: portfolioError } = await supabase
  .from('portfolio_images')
  .select('*')
  .order('display_order');

if (portfolioError) {
  console.log('❌ Error fetching portfolio images:', portfolioError);
} else {
  console.log('📸 PORTFOLIO IMAGES:');
  portfolioImages.forEach(img => {
    console.log(`  ${img.display_order}. ${img.alt_text}`);
    console.log(`     URL: ${img.image_url}`);
  });
}

// Check feature cards
const { data: featureCards, error: featureError } = await supabase
  .from('feature_cards')
  .select('*')
  .order('display_order');

if (featureError) {
  console.log('\n❌ Error fetching feature cards:', featureError);
} else {
  console.log('\n🎴 FEATURE CARDS:');
  featureCards.forEach(card => {
    console.log(`  ${card.display_order}. ${card.title}`);
    console.log(`     Image: ${card.image_url}`);
  });
}

// Check testimonials
const { data: testimonials, error: testimonialsError } = await supabase
  .from('testimonials')
  .select('*')
  .order('display_order');

if (testimonialsError) {
  console.log('\n❌ Error fetching testimonials:', testimonialsError);
} else {
  console.log('\n💬 TESTIMONIALS:');
  testimonials.forEach(t => {
    console.log(`  ${t.display_order}. ${t.name}`);
    console.log(`     Image: ${t.image_url || 'NONE'}`);
  });
}

// Check site settings for stats
const { data: statsData, error: statsError } = await supabase
  .from('site_settings')
  .select('*')
  .eq('key', 'stats')
  .single();

if (statsError) {
  console.log('\n❌ Error fetching stats:', statsError);
} else {
  console.log('\n📊 STATS SETTING:');
  console.log('  Value:', statsData?.value);
}

console.log('\n✅ Done!');
