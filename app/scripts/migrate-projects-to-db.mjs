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

// Parse .env file line by line
envContent.split(/\r?\n/).forEach(line => {
  // Skip comments and empty lines
  if (!line || line.startsWith('#')) return;
  
  const equalIndex = line.indexOf('=');
  if (equalIndex > -1) {
    const key = line.substring(0, equalIndex).trim();
    const value = line.substring(equalIndex + 1).trim();
    envVars[key] = value;
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_SERVICE_ROLE_KEY; // Use service role to bypass RLS

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('   URL:', supabaseUrl ? '✓' : '✗');
  console.error('   Service Role Key:', supabaseKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Projects from config.ts with Supabase Storage URLs
const projects = [
  {
    title: "Sadaham Puja",
    date_text: "10/07/2025",
    category: "Community",
    description: "A peaceful religious & cultural service project with community participation.",
    image_url: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/sadaham-puja-2025/sadahampuja01.jpeg",
    gallery_images: [
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/sadaham-puja-2025/sadahampuja01.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/sadaham-puja-2025/sadahampuja02.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/sadaham-puja-2025/sadahampuja03.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/sadaham-puja-2025/sadahampuja04.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/sadaham-puja-2025/sadahampuja05.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/sadaham-puja-2025/sadahampuja06.jpeg",
    ],
    is_featured: true,
    display_order: 1
  },
  {
    title: "Senehe Piruna Pitu",
    date_text: "06/09/2025",
    category: "Education",
    description: "Supporting underprivileged students by donating 1,000 CR books (120 pages).",
    image_url: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202509090025441359396179.jpeg",
    gallery_images: [
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202509090025441359396179.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/20250909114736638600007.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/20250909114833543531545.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202509091153241455692918.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202509091154452002035646.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202510092045521903323878.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202510092046391837341903.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/20251009204731781330478.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202510092107132468342.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202510092108021794907401.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202510092111141808225620.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202510092111311643513280.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/senehe-piruna-pitu/202510092112051064708016.jpeg",
    ],
    is_featured: true,
    display_order: 2
  },
  {
    title: "ELITE 25 Installation Ceremony",
    date_text: "20/09/2025",
    category: "Leadership",
    description: "Formal installation ceremony of Leo Club ELITE 25 with leadership transition and recognition of outgoing members.",
    image_url: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/elite-25/hero-image.jpeg",
    gallery_images: [
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/elite-25/hero-image.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/elite-25/20251006142358729209400.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/elite-25/20251006142438199798937.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/elite-25/20251006142517328323101.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/elite-25/202510061426051118596416.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/elite-25/202510092040312028265676.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/elite-25/202510092041142048999142.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/elite-25/20251009204436256080095.jpeg",
    ],
    is_featured: true,
    display_order: 3
  },
  {
    title: "International Tree Plantation Drive",
    date_text: "22/11/2025",
    category: "Environment",
    description: "International tree planting initiative supporting reforestation and environmental awareness across multiple Leo clubs.",
    image_url: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/202601122006121190925964.jpeg",
    gallery_images: [
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/202601122006121190925964.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/20260112200737899589340.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/202601122009211639179907.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/202601122009391941820572.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/20260112201117146957406.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/202601122011471161910028.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/202601122012131307866075.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/202601122013451441891787.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/20260112201435665349504.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/20260112201535441753713.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/international-tree-plantation-drive/202601152202091996883195.jpeg",
    ],
    is_featured: true,
    display_order: 4
  },
  {
    title: "Paradisaye Sahurda Yathra Flood Relief",
    date_text: "21/12/2025",
    category: "Community",
    description: "Flood relief donation drive supporting Sirasa Sahana Yathra to aid affected communities across Sri Lanka.",
    image_url: "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/202601122049011662332658.jpeg",
    gallery_images: [
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/202601122049011662332658.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/202601122049571431762039.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/20260112205202223714041.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/202601122052491670935903.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/20260112205440780965981.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/20260112205513186027367.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/202601152223061825038494.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/20260115222720309334382.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/20260115222737689942931.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/20260115223739144643106.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/20260115224205315589977.jpeg",
      "https://cyffuhudigwapmkffqes.supabase.co/storage/v1/object/public/images/projects/paradisaye-sahurda-yathra/20260115232414506820802.jpeg",
    ],
    is_featured: true,
    display_order: 5
  }
];

async function migrateProjects() {
  console.log('🚀 Starting project migration to database...\n');

  for (const project of projects) {
    console.log(`📦 Inserting: ${project.title}`);
    console.log(`   📅 Date: ${project.date_text}`);
    console.log(`   🏷️  Category: ${project.category}`);
    console.log(`   🖼️  Gallery: ${project.gallery_images.length} images`);

    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select();

    if (error) {
      console.error(`   ❌ Error: ${error.message}`);
    } else {
      console.log(`   ✅ Inserted successfully (ID: ${data[0].id})\n`);
    }
  }

  // Verify final count
  const { count, error: countError } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Error counting projects:', countError.message);
  } else {
    console.log(`\n✅ Migration complete! Total projects in database: ${count}`);
  }
}

migrateProjects();
