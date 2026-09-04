const fs = require('fs');
const glob = ['src/app/needs/page.tsx', 'src/app/needs/[slug]/page.tsx', 'src/app/start-here/page.tsx', 'src/app/start-here/[slug]/page.tsx', 'src/app/romania/page.tsx', 'src/app/romania/[slug]/page.tsx'];

glob.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let original = fs.readFileSync(filePath, 'utf8');
    if (!original.includes('<EvaluationCTA')) {
        const importPath = (filePath.includes('[slug]') || filePath.includes('investment')) ? "../../../components/EvaluationCTA" : "../../components/EvaluationCTA";
        original = original.replace(/(import .*;\n)+/m, match => match + `import { EvaluationCTA } from '${importPath}';\n`);
        
        if (original.includes('useAppContext()') && !original.includes('onOpenEvaluationModal')) {
          original = original.replace(/const { ([^}]+) } = useAppContext\(\);/g, "const { $1, onOpenEvaluationModal } = useAppContext();");
        }
        
        original = original.replace(/return \(\s*<([A-Z]\w+)[^>]*\/>\s*\);/, match => {
          let comp = match.match(/<([A-Z]\w+)[^>]*\/>/)[0];
          return `return (
    <div className="space-y-12">
      ${comp}
      <EvaluationCTA currentLang={currentLang} onOpenModal={onOpenEvaluationModal} />
    </div>
  );`;
        });
        fs.writeFileSync(filePath, original);
        console.log('Wrapped and added CTA to:', filePath);
    }
  }
});
