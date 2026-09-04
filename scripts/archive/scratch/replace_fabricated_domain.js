const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const appDir = path.join(__dirname, '..', 'src', 'app');

walkDir(appDir, filePath => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Check if the file contains the domain
    if (content.includes('dorvia.eu')) {
      // 1. Replace template literal URLs first (to prevent double backticks)
      content = content.replace(/`https:\/\/dorvia\.eu\/([^`]+)`/g, '`${SITE_URL}/$1`');
      
      // 2. Replace static string URLs with backticks
      content = content.replace(/'https:\/\/dorvia\.eu\/([^']+)'/g, '`${SITE_URL}/$1`');
      content = content.replace(/"https:\/\/dorvia\.eu\/([^"]+)"/g, '`${SITE_URL}/$1`');
      
      // 3. Replace base domain alone
      content = content.replace(/'https:\/\/dorvia\.eu\/'/g, 'SITE_URL');
      content = content.replace(/"https:\/\/dorvia\.eu\/"/g, 'SITE_URL');
      content = content.replace(/'https:\/\/dorvia\.eu'/g, 'SITE_URL');
      content = content.replace(/"https:\/\/dorvia\.eu"/g, 'SITE_URL');
      
      // 4. In sitemap.ts, replace the declaration
      content = content.replace(/const baseUrl = 'https:\/\/dorvia\.eu';/g, 'const baseUrl = SITE_URL;');

      // 5. Add import statement if it doesn't already exist
      if (!content.includes("import { SITE_URL }")) {
        // Add import at the top of the file
        content = "import { SITE_URL } from '@/config';\n" + content;
      }
      
      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated file: ${filePath}`);
      }
    }
  }
});
