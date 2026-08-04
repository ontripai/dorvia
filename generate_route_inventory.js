const fs = require('fs');
const path = require('path');

function getPhysicalRoutes() {
  const routes = [];
  function walk(dir, basePath) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath, basePath + '/' + file);
      } else {
        if (file === 'page.tsx' || file === 'route.ts') {
          routes.push(basePath);
        }
      }
    });
  }
  walk('src/app', '');
  return routes.map(r => r === '' ? '/' : r.replace(/\\/g, '/'));
}

const pageMetaContent = fs.readFileSync('src/lib/pageMeta.ts', 'utf8');
const metaKeys = [];
const regex = /'([^']+)'\s*:/g;
let match;
while ((match = regex.exec(pageMetaContent)) !== null) {
  metaKeys.push('/' + match[1]);
}

const physical = getPhysicalRoutes();
const allRoutes = new Set([...physical, ...metaKeys.map(k => k.startsWith('/') ? k : '/' + k)]);

let md = '# Before-Change Route Inventory\n\n| Route | Type | Note |\n|---|---|---|\n';
allRoutes.forEach(r => {
  let type = [];
  if (physical.includes(r)) type.push('Physical');
  if (metaKeys.includes(r) || r === '/home' || r === '/') type.push('PageMeta');
  
  // Specific checks
  if (r.includes('[slug]')) type.push('Dynamic');
  
  md += `| ${r} | ${type.join(', ')} | |\n`;
});

fs.mkdirSync('docs/seo', { recursive: true });
fs.writeFileSync('docs/seo/route-inventory-before.md', md, 'utf8');
console.log('Generated route-inventory-before.md');
