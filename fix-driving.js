const fs = require('fs');
['en.ts', 'fa.ts'].forEach(file => {
  const path = 'src/content/guides/driving-license/' + file;
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/description:\s*'([^']*)'/g, "description: '$1', status: 'VERIFIED', reviewDate: '2026-08-05'");
  fs.writeFileSync(path, content);
});
