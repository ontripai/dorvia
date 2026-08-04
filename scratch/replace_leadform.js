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
  if (filePath.endsWith('.tsx') && !filePath.includes('page.tsx') && !filePath.includes('layout.tsx')) return;
  if (!filePath.endsWith('.tsx')) return;
  
  const original = fs.readFileSync(filePath, 'utf8');
  if (original.includes('LeadForm')) {
    // Only replace if it's an internal page (not the root page.tsx)
    if (filePath === path.normalize('src/app/page.tsx')) {
       console.log('Skipping root page:', filePath);
       return;
    }
    
    let modified = original.replace(/import { LeadForm } from '.*LeadForm';/g, "import { EvaluationCTA } from '" + (filePath.includes('[slug]') || filePath.includes('investment') ? "../../../" : "../../") + "components/EvaluationCTA';");
    
    // Replace <LeadForm currentLang={currentLang} /> and variations
    modified = modified.replace(/<LeadForm [^>]*\/>/g, "<EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />");
    
    // If onOpenEvaluationModal is not in useAppContext destructuring, add it
    if (modified.includes('useAppContext()') && !modified.includes('onOpenEvaluationModal')) {
      modified = modified.replace(/const { ([^}]+) } = useAppContext\(\);/g, "const { $1, onOpenEvaluationModal } = useAppContext();");
    }
    
    fs.writeFileSync(filePath, modified);
    console.log('Modified:', filePath);
  }
});
