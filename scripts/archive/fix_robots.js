const fs = require('fs');

const filesToUpdate = [
  'src/app/services/layout.tsx',
  'src/app/articles/layout.tsx',
  'src/app/legal/[slug]/layout.tsx',
  'src/app/needs/[slug]/layout.tsx',
  'src/app/romania/[slug]/layout.tsx',
  'src/app/admin/comments/page.tsx'
];

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    if (!content.includes('import { isProduction } from')) {
      content = content.replace("import { SITE_URL } from '@/config';", "import { SITE_URL, isProduction } from '@/config';");
      // if not found above, it might be in admin/comments
      if (!content.includes("import { SITE_URL }")) {
        content = "import { isProduction } from '@/config';\n" + content;
      }
    }
    
    // Replace explicit robots objects with conditional
    if (file.includes('admin/comments/page.tsx')) {
       // Should always be index: false, follow: false, regardless of production, actually Wait.
       // admin comments doesn't need isProduction wrapper since it should be noindex nofollow in both.
       return;
    }

    if (content.includes('robots: {')) {
       content = content.replace(/robots:\s*\{[\s\S]*?\}/, (match) => {
          return `robots: isProduction ? ${match.replace('robots:', '')} : undefined`;
       });
    } else if (content.includes('robots: meta.noindex')) {
       content = content.replace(/robots:\s*meta\.noindex\s*\?\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}\s*:\s*undefined/, "robots: isProduction ? (meta.noindex ? { index: false, follow: true } : undefined) : undefined");
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
