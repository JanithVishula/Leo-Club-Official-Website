#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔄 Updating config.ts with Supabase Storage URLs...\n');

// Load migration report
const reportPath = join(__dirname, 'migration-report.json');
const configPath = join(__dirname, '../src/config.ts');

const report = JSON.parse(await readFile(reportPath, 'utf-8'));
let config = await readFile(configPath, 'utf-8');

let updateCount = 0;

// Helper function to get Supabase URL for a project image
function getProjectImageUrl(projectFolder, imageName) {
  const project = report.projects.find(p => 
    p.folder.toLowerCase() === projectFolder.toLowerCase()
  );
  
  if (!project) return null;
  
  const image = project.images.find(img => 
    img.original.toLowerCase() === imageName.toLowerCase()
  );
  
  return image ? image.url : null;
}

// Helper function to get member image URL
function getMemberImageUrl(imageName) {
  const member = report.members.find(m => 
    m.original.toLowerCase() === imageName.toLowerCase()
  );
  
  return member ? member.url : null;
}

console.log('📝 Processing project images...');

// Update project URLs - handle both relative and absolute paths
const projectPatterns = [
  // Sadaham Puja 2025
  {
    folder: 'Sadaham Puja 2025',
    files: [
      'SadahamPuja01.jpeg',
      'SadahamPuja02.jpeg',
      'SadahamPuja03.jpeg',
      'SadahamPuja04.jpeg',
      'SadahamPuja05.jpeg',
      'SadahamPuja06.jpeg'
    ]
  },
  // Senehe Piruna Pitu
  {
    folder: 'Senehe Piruna Pitu',
    files: [
      '202509090025441359396179.jpeg',
      '20250909114736638600007.jpeg',
      '20250909114833543531545.jpeg',
      '202509091153241455692918.jpeg',
      '202509091154452002035646.jpeg',
      '202510092045521903323878.jpeg',
      '202510092046391837341903.jpeg',
      '20251009204731781330478.jpeg',
      '202510092107132468342.jpeg',
      '202510092108021794907401.jpeg',
      '202510092111141808225620.jpeg',
      '202510092111311643513280.jpeg',
      '202510092112051064708016.jpeg'
    ]
  },
  // ELITE 25
  {
    folder: 'ELITE 25',
    files: [
      '202510061423151722794723.jpeg',
      '20251006142358729209400.jpeg',
      '20251006142438199798937.jpeg',
      '20251006142517328323101.jpeg',
      '202510061426051118596416.jpeg',
      '202510092040312028265676.jpeg',
      '202510092041142048999142.jpeg',
      '20251009204436256080095.jpeg'
    ]
  },
  // International Tree Plantation Drive
  {
    folder: 'International Tree Plantation Drive',
    files: [
      '202601122006121190925964.jpeg',
      '20260112200737899589340.jpeg',
      '202601122009211639179907.jpeg',
      '202601122009391941820572.jpeg',
      '20260112201117146957406.jpeg',
      '202601122011471161910028.jpeg',
      '202601122012131307866075.jpeg',
      '202601122013451441891787.jpeg',
      '20260112201435665349504.jpeg',
      '20260112201535441753713.jpeg',
      '202601152202091996883195.jpeg'
    ]
  },
  // Paradisaye Sahurda Yathra
  {
    folder: 'Paradisaye Sahurda Yathra',
    files: [
      '202601122049011662332658.jpeg',
      '202601122049571431762039.jpeg',
      '20260112205202223714041.jpeg',
      '202601122052491670935903.jpeg',
      '20260112205440780965981.jpeg',
      '20260112205513186027367.jpeg',
      '202601152223061825038494.jpeg',
      '20260115222720309334382.jpeg',
      '20260115222737689942931.jpeg',
      '20260115223739144643106.jpeg',
      '20260115224205315589977.jpeg',
      '20260115232414506820802.jpeg'
    ]
  }
];

for (const { folder, files } of projectPatterns) {
  for (const fileName of files) {
    const oldPath = `/projects/${folder}/${fileName}`;
    const newUrl = getProjectImageUrl(folder, fileName);
    
    if (newUrl) {
      const escapedOldPath = oldPath.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
      const regex = new RegExp(`"${escapedOldPath}"`, 'g');
      const matches = config.match(regex);
      
      if (matches) {
        config = config.replace(regex, `"${newUrl}"`);
        updateCount += matches.length;
        console.log(`  ✅ ${fileName} → Supabase URL (${matches.length} occurrence${matches.length > 1 ? 's' : ''})`);
      }
    }
  }
}

console.log('\n👥 Processing member images...');

// Update member URLs
const memberImages = [
  'Chamath Jayalath.jpg',
  'Hasindu Induwara.jpg',
  'Janith Vishula.jpg',
  'Lithira Ramuditha.jpg'
];

for (const fileName of memberImages) {
  const oldPath = `/${fileName}`;
  const newUrl = getMemberImageUrl(fileName);
  
  if (newUrl) {
    const regex = new RegExp(`"${oldPath}"`, 'g');
    const matches = config.match(regex);
    
    if (matches) {
      config = config.replace(regex, `"${newUrl}"`);
      updateCount += matches.length;
      console.log(`  ✅ ${fileName} → Supabase URL (${matches.length} occurrence${matches.length > 1 ? 's' : ''})`);
    }
  }
}

// Save updated config
await writeFile(configPath, config, 'utf-8');

console.log('\n' + '='.repeat(60));
console.log(`✅ Config updated successfully!`);
console.log(`📊 Total replacements: ${updateCount}`);
console.log('='.repeat(60));
console.log('\n💡 Next: Test your site with `npm run dev` to verify images load correctly\n');
