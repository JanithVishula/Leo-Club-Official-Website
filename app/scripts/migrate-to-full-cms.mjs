#!/usr/bin/env node

/**
 * Migrate all config.ts data to Supabase CMS
 * Run this script to populate database tables with existing content
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load from .env or .env.local file
let supabaseUrl = process.env.VITE_SUPABASE_URL;
let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Allow passing credentials as arguments (check this FIRST)
if (process.argv.length >= 4) {
  supabaseUrl = process.argv[2];
  supabaseServiceKey = process.argv[3];
}

if (!supabaseUrl || !supabaseServiceKey) {
  const envFiles = [
    join(__dirname, '..', '.env'),
    join(__dirname, '..', '.env.local')
  ];
  
  for (const envPath of envFiles) {
    try {
      const envContent = readFileSync(envPath, 'utf-8');
      const envLines = envContent.split('\n');
      
      envLines.forEach(line => {
        const match = line.match(/^([^=]+)=(.+)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim();
          if (key === 'VITE_SUPABASE_URL' && !supabaseUrl) supabaseUrl = value;
          if ((key === 'SUPABASE_SERVICE_ROLE_KEY' || key === 'VITE_SUPABASE_SERVICE_ROLE_KEY') && !supabaseServiceKey) {
            supabaseServiceKey = value;
          }
        }
      });
    } catch (err) {
      // File doesn't exist, try next one
    }
  }
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials\n');
  console.error('📝 Required in .env file:');
  console.error('   VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.error('   VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n');
  console.error('🔑 To get your SERVICE_ROLE_KEY:');
  console.error('   1. Go to https://supabase.com/dashboard');
  console.error('   2. Select your project');
  console.error('   3. Settings → API → Project API keys');
  console.error('   4. Copy "service_role" key (not the anon key!)');
  console.error('   5. Add to app/.env file\n');
  console.error('Or run with arguments:');
  console.error('   node scripts/migrate-to-full-cms.mjs <URL> <SERVICE_KEY>\n');
  process.exit(1);
}

// Use service_role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// =========================
// CONFIG DATA
// =========================

const boardMembersData = [
  {
    name: "Leo Lion Thavisha Bandara",
    role: "President",
    image_url: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/members/janith-vishula.jpg",
    display_order: 1
  },
  {
    name: "Leo Lion Hasindu Induwara",
    role: "Vice President",
    image_url: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/members/hasindu-induwara.jpg",
    display_order: 2
  },
  {
    name: "Leo Onel Herath",
    role: "Secretary",
    image_url: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/members/onel-herath.jpg",
    display_order: 3
  }
];

const testimonialsData = [
  {
    name: "Governor Lion Gaya Upasena",
    role: "District Governor for Lions District 306 D7 (2025/2026)",
    image_url: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/members/lion-gaya-upasena.jpg",
    quote: "Being part of Leo Club has transformed my perspective on leadership. I've learned that true leadership is about serving others and creating positive change in our community.",
    display_order: 1
  },
  {
    name: "Lion Ranjith Fernando",
    role: "Immediate Past District Governor for Lions District 306 C2 (2024/2025)",
    image_url: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/members/lion-ranjith-fernando.jpeg",
    quote: "The friendships I've made and the skills I've developed here are invaluable. Leo Club gave me the platform to turn my ideas into real community impact.",
    display_order: 2
  },
  {
    name: "Lion Chamath C.Jayalath",
    role: "Club President of Lions Club of Pannipitiya Paradise",
    image_url: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/members/chamath-jayalath.jpg",
    quote: "From organizing health camps to environmental projects, every experience has been rewarding. I'm proud to be part of an organization that truly cares.",
    display_order: 3
  },
  {
    name: "Leo Lion Lithira Ramuditha",
    role: "Immediate Past President of Leo Club of Pannipitiya Paradise",
    image_url: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/members/lithira-ramuditha.jpg",
    quote: "Leo Club taught me the value of teamwork and dedication. Working with passionate young people toward common goals has been an incredible journey.",
    display_order: 4
  }
];

const faqsData = [
  {
    question: "What is Leo Club?",
    answer: "Leo Club is a youth organization sponsored by Lions Clubs International. It provides young people with opportunities for personal growth, leadership development, and community service. 'LEO' stands for Leadership, Experience, and Opportunity.",
    display_order: 1
  },
  {
    question: "How can I join Leo Club of Pannipitiya Paradise?",
    answer: "We welcome young people aged 18-30 who are passionate about community service and personal development. You can contact us through our social media pages or email to express your interest in joining. We conduct regular recruitment drives throughout the year.",
    display_order: 2
  },
  {
    question: "What types of projects does the club organize?",
    answer: "We organize a wide range of projects including environmental initiatives, educational support programs, fundraising events for charitable causes and leadership development workshops. Our projects are designed to address real community needs.",
    display_order: 3
  },
  {
    question: "Are there any membership fees?",
    answer: "Yes, there is a nominal annual membership fee that covers administrative costs and club activities. The exact amount varies by year and will be communicated during the application process. Financial assistance is available for those who need it.",
    display_order: 4
  },
  {
    question: "What's the time commitment for members?",
    answer: "We understand that members have varying schedules with studies and work. We aim for flexibility while maintaining active participation. Most projects are planned in advance, and members can participate based on their availability.",
    display_order: 5
  },
  {
    question: "What benefits do members get?",
    answer: "Members develop leadership skills, build professional networks, gain community service experience, receive certificates for their contributions, and have opportunities to attend district and international Leo conventions. It's also a great way to make lifelong friends!",
    display_order: 6
  }
];

const servicesData = [
  {
    title: "Community Development",
    description: "Empowering local communities through sustainable development projects and social initiatives.",
    icon_name: "Users",
    display_order: 1
  },
  {
    title: "Environmental Conservation",
    description: "Protecting our planet through tree planting, clean-up drives, and environmental awareness campaigns.",
    icon_name: "Leaf",
    display_order: 2
  },
  {
    title: "Education Support",
    description: "Providing educational resources and opportunities to underprivileged students across Sri Lanka.",
    icon_name: "BookOpen",
    display_order: 3
  },
  {
    title: "Leadership Training",
    description: "Developing future leaders through workshops, seminars, and hands-on leadership experiences.",
    icon_name: "Award",
    display_order: 4
  },
  {
    title: "Health & Wellness",
    description: "Organizing health camps, awareness programs, and supporting healthcare initiatives in underserved areas.",
    icon_name: "Heart",
    display_order: 5
  },
  {
    title: "Youth Empowerment",
    description: "Creating platforms for young people to express themselves, develop skills, and become changemakers.",
    icon_name: "Zap",
    display_order: 6
  }
];

const featureCardsData = [
  {
    title: "Leadership Development",
    description: "Develop essential leadership skills through hands-on projects and training programs",
    image_url: "/feature-1.jpg",
    image_alt: "Leadership training session",
    display_order: 1
  },
  {
    title: "Community Impact",
    description: "Make a tangible difference in your community through meaningful service projects",
    image_url: "/feature-2.jpg",
    image_alt: "Community service project",
    display_order: 2
  },
  {
    title: "Global Network",
    description: "Connect with thousands of young leaders across the world through Lions International",
    image_url: "/feature-3.jpg",
    image_alt: "International Leo convention",
    display_order: 3
  }
];

const portfolioImagesData = [
  {
    image_url: "/portfolio-1.jpg",
    image_alt: "Community service project",
    display_order: 1
  },
  {
    image_url: "/portfolio-2.jpg",
    image_alt: "Environmental initiative",
    display_order: 2
  },
  {
    image_url: "/portfolio-3.jpg",
    image_alt: "Leadership workshop",
    display_order: 3
  },
  {
    image_url: "/portfolio-4.jpg",
    image_alt: "Tree planting drive",
    display_order: 4
  },
  {
    image_url: "/portfolio-5.jpg",
    image_alt: "Education support program",
    display_order: 5
  },
  {
    image_url: "/portfolio-6.jpg",
    image_alt: "Health awareness campaign",
    display_order: 6
  }
];

// =========================
// MIGRATION FUNCTIONS
// =========================

async function migrateTable(tableName, data) {
  console.log(`\n📦 Migrating ${tableName}...`);
  
  if (!data || data.length === 0) {
    console.log(`   ⚠️  No data to migrate for ${tableName}`);
    return { success: true, count: 0 };
  }

  const { data: inserted, error } = await supabase
    .from(tableName)
    .insert(data)
    .select();

  if (error) {
    console.error(`   ❌ Error migrating ${tableName}:`, error.message);
    return { success: false, error };
  }

  console.log(`   ✅ Migrated ${inserted.length} records to ${tableName}`);
  return { success: true, count: inserted.length, data: inserted };
}

async function clearTable(tableName) {
  console.log(`🗑️  Clearing ${tableName}...`);
  const { error } = await supabase
    .from(tableName)
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (error && !error.message.includes('no rows')) {
    console.error(`   ⚠️  Warning clearing ${tableName}:`, error.message);
  }
}

// =========================
// MAIN MIGRATION
// =========================

async function main() {
  console.log('🚀 Starting Full CMS Migration...\n');
  console.log('📋 This will migrate all data from config.ts to Supabase\n');

  const results = {
    successful: [],
    failed: [],
    totalRecords: 0
  };

  // Optionally clear existing data (comment out if you want to keep existing data)
  const clearFirst = process.argv.includes('--clear');
  if (clearFirst) {
    console.log('⚠️  CLEARING EXISTING DATA (--clear flag detected)\n');
    await clearTable('board_members');
    await clearTable('testimonials');
    await clearTable('faqs');
    await clearTable('services');
    await clearTable('feature_cards');
    await clearTable('portfolio_images');
  }

  // Migrate all tables
  const migrations = [
    { table: 'board_members', data: boardMembersData },
    { table: 'testimonials', data: testimonialsData },
    { table: 'faqs', data: faqsData },
    { table: 'services', data: servicesData },
    { table: 'feature_cards', data: featureCardsData },
    { table: 'portfolio_images', data: portfolioImagesData }
  ];

  for (const { table, data } of migrations) {
    const result = await migrateTable(table, data);
    
    if (result.success) {
      results.successful.push(table);
      results.totalRecords += result.count;
    } else {
      results.failed.push(table);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 MIGRATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Successful: ${results.successful.length} tables`);
  console.log(`❌ Failed: ${results.failed.length} tables`);
  console.log(`📝 Total records migrated: ${results.totalRecords}`);
  
  if (results.successful.length > 0) {
    console.log(`\n✅ Migrated tables: ${results.successful.join(', ')}`);
  }
  
  if (results.failed.length > 0) {
    console.log(`\n❌ Failed tables: ${results.failed.join(', ')}`);
  }

  console.log('\n💡 Next steps:');
  console.log('   1. Run SQL migration: supabase db push or execute 002_full_cms_tables.sql');
  console.log('   2. Update cmsApi.ts to add fetch functions for new tables');
  console.log('   3. Update frontend components to use database data');
  console.log('   4. Test all sections to ensure data displays correctly');
  
  console.log('\n✨ Migration complete!\n');
}

main().catch(console.error);
