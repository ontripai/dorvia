const fs = require('fs');
const path = require('path');

const appServerDir = path.join(__dirname, '..', '.next', 'server', 'app');

if (!fs.existsSync(appServerDir)) {
  console.error("Error: Next.js app build directory not found. Please run 'npm run build' first.");
  process.exit(1);
}

function findHtmlFiles(dir, files = []) {
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      findHtmlFiles(p, files);
    } else if (p.endsWith('.html') && !p.includes('_not-found') && !p.includes('robots.txt')) {
      files.push(p);
    }
  });
  return files;
}

const htmlFiles = findHtmlFiles(appServerDir);
console.log(`Found ${htmlFiles.length} HTML pages to verify.`);

let failed = false;

htmlFiles.forEach(file => {
  const relPath = path.relative(appServerDir, file);
  const html = fs.readFileSync(file, 'utf8');

  // 1. Verify exact 1 H1
  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (h1Matches.length !== 1) {
    console.error(`❌ [H1 ERROR] ${relPath} has ${h1Matches.length} H1 tags (expected exactly 1).`);
    failed = true;
  }

  // 2. Extract Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'NONE';

  // 3. Extract Meta Description
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || html.match(/<meta\s+content="([^"]*)"\s+name="description"/i);
  const desc = descMatch ? descMatch[1] : 'NONE';

  // 4. Extract Canonical Link
  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i) || html.match(/<link\s+href="([^"]*)"\s+rel="canonical"/i);
  const canonical = canonicalMatch ? canonicalMatch[1] : 'NONE';

  // 5. Extract Robots Meta
  const robotsMatch = html.match(/<meta\s+name="robots"\s+content="([^"]*)"/i) || html.match(/<meta\s+content="([^"]*)"\s+name="robots"/i);
  const robots = robotsMatch ? robotsMatch[1] : 'index, follow';

  console.log(`\n📄 Page: ${relPath}`);
  console.log(`   Title: ${title}`);
  console.log(`   Desc: ${desc}`);
  console.log(`   Canonical: ${canonical}`);
  console.log(`   Robots: ${robots}`);
  console.log(`   H1 Tag: ${h1Matches.length === 1 ? '✓ OK' : '❌ ERROR'}`);
});

if (failed) {
  process.exit(1);
} else {
  console.log("\n✅ All pages passed SEO structural checks!");
}
