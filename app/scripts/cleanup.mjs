
// Cleanup script - Run this after verifying uploads
import { rm } from 'fs/promises';

async function cleanup() {
  const report = await import('./migration-report.json', { with: { type: 'json' } });
  
  // Remove member images
  for (const member of report.default.members) {
    await rm(member.localPath);
    console.log('Deleted:', member.localPath);
  }
  
  // Remove project folders
  for (const project of report.default.projects) {
    await rm(project.localPath, { recursive: true });
    console.log('Deleted:', project.localPath);
  }
  
  // Remove achievement images
  for (const achievement of report.default.achievements) {
    await rm(achievement.localPath);
    console.log('Deleted:', achievement.localPath);
  }
  
  console.log('✅ Cleanup complete!');
}

cleanup();
