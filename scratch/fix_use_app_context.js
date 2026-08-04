const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src/app', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let original = fs.readFileSync(filePath, 'utf8');
    if (original.includes('useAppContext()') && original.includes('onOpenEvaluationModal')) {
      if (!original.match(/const\s*{\s*[^}]*onOpenEvaluationModal[^}]*}\s*=\s*useAppContext\(\);/)) {
        const newContent = original.replace(/const\s*{\s*([^}]+)\s*}\s*=\s*useAppContext\(\);/, "const { $1, onOpenEvaluationModal } = useAppContext();");
        if (newContent !== original) {
           fs.writeFileSync(filePath, newContent);
           console.log('Fixed useAppContext in:', filePath);
        }
      }
    }
  }
});
