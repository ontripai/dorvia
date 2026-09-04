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

const srcDir = path.join(__dirname, '..', 'src');

walkDir(srcDir, filePath => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    content = content.replace(/آخرین بررسی: ۲۰۲۶/g, 'آخرین بررسی: مرداد ۱۴۰۵ / اوت ۲۰۲۶');
    content = content.replace(/Last reviewed: 2026/g, 'Last reviewed: August 2026');
    content = content.replace(/آخرین بروزرسانی: ۲۰۲۶/g, 'آخرین بروزرسانی: مرداد ۱۴۰۵ / اوت ۲۰۲۶');
    content = content.replace(/Updated: 2026/g, 'Updated: August 2026');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Replaced dates in: ${filePath}`);
    }
  }
});
