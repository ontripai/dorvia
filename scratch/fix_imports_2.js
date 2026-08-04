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
    if (original.includes('import { EvaluationCTA }')) {
       const depth = filePath.split(path.sep).length - 2;
       const prefix = '../'.repeat(depth);
       const correctPath = prefix + 'components/EvaluationCTA';
       
       const newContent = original.replace(/import \{ EvaluationCTA \} from '[^']+';/g, `import { EvaluationCTA } from '${correctPath}';`);
       if (newContent !== original) {
           fs.writeFileSync(filePath, newContent);
           console.log('Fixed path in:', filePath);
       }
    }
  }
});
