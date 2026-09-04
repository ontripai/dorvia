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
  if (filePath.endsWith('.tsx') && !filePath.includes('layout.tsx') && !filePath.includes('not-found.tsx') && !filePath.includes('error.tsx')) {
    if (filePath === path.normalize('src/app/page.tsx')) return;
    
    let original = fs.readFileSync(filePath, 'utf8');
    
    if (!original.includes('<EvaluationCTA')) {
      // Add import if missing
      if (!original.includes('import { EvaluationCTA }')) {
         const importPath = (filePath.includes('[slug]') || filePath.includes('investment')) ? "../../../components/EvaluationCTA" : "../../components/EvaluationCTA";
         original = original.replace(/(import .*;\n)+/m, match => match + `import { EvaluationCTA } from '${importPath}';\n`);
      }
      
      // Ensure onOpenEvaluationModal is in useAppContext
      if (original.includes('useAppContext()') && !original.includes('onOpenEvaluationModal')) {
        original = original.replace(/const { ([^}]+) } = useAppContext\(\);/g, "const { $1, onOpenEvaluationModal } = useAppContext();");
      }
      
      let lastDivIndex = original.lastIndexOf('</div>');
      if (lastDivIndex !== -1) {
         let before = original.substring(0, lastDivIndex);
         let after = original.substring(lastDivIndex);
         original = before + `  <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />\n    ` + after;
         
         fs.writeFileSync(filePath, original);
         console.log('Added EvaluationCTA to:', filePath);
      }
    }
  }
});
