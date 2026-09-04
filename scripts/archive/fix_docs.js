const fs = require('fs');
const path = require('path');

const seoDir = 'docs/seo';
const files = fs.readdirSync(seoDir).map(f => path.join(seoDir, f)).filter(f => f.endsWith('.md'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  if (content.includes('Production safety is verified.')) {
    content = content.replace('Production safety is verified.', 'Preview deployment verified. Final production-domain verification pending.');
    changed = true;
  }
  
  if (content.includes('Production safety verified')) {
    content = content.replace('Production safety verified', 'Preview deployment verified. Final production-domain verification pending');
    changed = true;
  }
  
  if (content.includes('Zero defects')) {
     content = content.replace('Zero defects', 'Preview deployment verified');
     changed = true;
  }

  if (content.includes('No defects were found requiring a hotfix.')) {
     content = content.replace('No defects were found requiring a hotfix.', 'No defects were found requiring a hotfix. Production-targeted SEO configuration verified.');
     changed = true;
  }

  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated ' + f);
  }
});
