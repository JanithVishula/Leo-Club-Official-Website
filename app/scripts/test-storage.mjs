#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Testing Supabase Storage Configuration...\n');

// Load environment variables
const envPath = join(__dirname, '../.env');
let supabaseUrl = '';
let supabaseKey = '';

try {
  const envContent = await readFile(envPath, 'utf-8');
  const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
  const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
  
  if (urlMatch) supabaseUrl = urlMatch[1].trim();
  if (keyMatch) supabaseKey = keyMatch[1].trim();
} catch (error) {
  console.error('❌ Could not read .env file');
  process.exit(1);
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase client initialized');
console.log(`📍 URL: ${supabaseUrl}\n`);

// Test 1: Check if bucket exists
console.log('🪣 Test 1: Checking if "images" bucket exists...');
try {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('❌ Error listing buckets:', error.message);
    console.log('\n⚠️  This usually means the storage policies are not set up correctly.');
    console.log('📝 Action Required:');
    console.log('   1. Go to Supabase Dashboard → SQL Editor');
    console.log('   2. Copy and paste the content from: app/supabase/schema.sql');
    console.log('   3. Execute the SQL to create storage bucket and policies\n');
  } else {
    const imagesBucket = buckets?.find(b => b.id === 'images');
    if (imagesBucket) {
      console.log('✅ "images" bucket exists');
      console.log(`   - Public: ${imagesBucket.public}`);
      console.log(`   - Created: ${imagesBucket.created_at}\n`);
      
      if (!imagesBucket.public) {
        console.log('⚠️  WARNING: Bucket is NOT public!');
        console.log('📝 Fix: Run this SQL in Supabase Dashboard:\n');
        console.log('   UPDATE storage.buckets SET public = true WHERE id = \'images\';\n');
      }
    } else {
      console.log('❌ "images" bucket does NOT exist');
      console.log('\n📝 Action Required:');
      console.log('   Run the SQL from: app/supabase/schema.sql\n');
    }
  }
} catch (error) {
  console.error('❌ Unexpected error:', error.message);
}

// Test 2: List files in bucket
console.log('📂 Test 2: Listing files in "images" bucket...');
try {
  const { data: files, error } = await supabase.storage
    .from('images')
    .list('projects', { limit: 10 });
  
  if (error) {
    console.error('❌ Error listing files:', error.message);
    if (error.message.includes('not found')) {
      console.log('\n⚠️  The "images" bucket does not exist yet.');
      console.log('📝 Run app/supabase/schema.sql in Supabase Dashboard\n');
    }
  } else {
    console.log(`✅ Found ${files?.length || 0} folders in projects/`);
    if (files && files.length > 0) {
      console.log('   Folders:', files.slice(0, 5).map(f => f.name).join(', '));
      console.log('');
    }
  }
} catch (error) {
  console.error('❌ Unexpected error:', error.message);
}

// Test 3: Try to access a specific image URL
console.log('🖼️  Test 3: Testing direct image URL access...');
const testImageUrl = 'https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/202601122049011662332658.jpeg';
console.log(`   Testing: ${testImageUrl.substring(0, 80)}...`);

try {
  const response = await fetch(testImageUrl);
  if (response.ok) {
    console.log('✅ Image URL is publicly accessible');
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Content-Type: ${response.headers.get('content-type')}\n`);
  } else {
    console.log(`❌ Image URL returned error: ${response.status} ${response.statusText}`);
    
    if (response.status === 404) {
      console.log('\n⚠️  Image not found. Possible reasons:');
      console.log('   1. Migration script ran but files weren\'t uploaded');
      console.log('   2. Wrong URL or folder structure');
      console.log('   3. Files were deleted');
      console.log('\n📝 Check: Supabase Dashboard → Storage → images');
    } else if (response.status === 403) {
      console.log('\n⚠️  Access forbidden. The bucket might not be public.');
      console.log('📝 Run this SQL to make it public:\n');
      console.log('   UPDATE storage.buckets SET public = true WHERE id = \'images\';');
    }
    console.log('');
  }
} catch (error) {
  console.error('❌ Could not fetch image:', error.message);
}

// Test 4: Check storage policies
console.log('🔒 Test 4: Verifying storage policies...');
try {
  const { data: policies, error } = await supabase
    .from('storage.policies')
    .select('*')
    .eq('bucket_id', 'images');
  
  if (error) {
    console.log('⚠️  Could not check policies (might need admin access)');
  } else {
    console.log(`✅ Found ${policies?.length || 0} storage policies`);
    if (policies && policies.length > 0) {
      policies.forEach(p => {
        console.log(`   - ${p.name} (${p.command})`);
      });
    }
  }
  console.log('');
} catch (error) {
  console.log('⚠️  Could not check policies:', error.message);
  console.log('');
}

// Summary
console.log('='.repeat(60));
console.log('📊 DIAGNOSTIC SUMMARY');
console.log('='.repeat(60));
console.log('\nIf images are not loading on your website:');
console.log('');
console.log('1. ✓ Verify bucket exists and is PUBLIC');
console.log('2. ✓ Confirm files were uploaded to Supabase Storage');
console.log('3. ✓ Test image URLs directly in browser');
console.log('4. ✓ Check browser console (F12) for CORS/404 errors');
console.log('5. ✓ Ensure you ran app/supabase/schema.sql in Supabase');
console.log('');
console.log('Most Common Issue:');
console.log('→ You haven\'t run schema.sql in Supabase Dashboard yet!');
console.log('');
console.log('Go to: https://supabase.com/dashboard → SQL Editor');
console.log('Copy: app/supabase/schema.sql content and execute it');
console.log('='.repeat(60));
console.log('');
