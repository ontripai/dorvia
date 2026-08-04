const fs = require('fs');
const files = [
  'src/components/StartHereContent.tsx',
  'src/components/MobileDrawer.tsx',
  'src/components/DesktopMegaMenu.tsx',
  'src/components/MainContent.tsx'
];
files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/start-here\/just-arrived/g, 'start-here/newly-arrived');
    content = content.replace(/start-here\/living-here/g, 'start-here/settling-in');
    content = content.replace(/start-here\/first-three-days/g, 'start-here/newly-arrived');
    content = content.replace(/start-here\/first-month/g, 'start-here/settling-in');
    content = content.replace(/case 'just-arrived':/g, "case 'newly-arrived':");
    content = content.replace(/case 'living-here':/g, "case 'settling-in':");
    fs.writeFileSync(f, content, 'utf8');
  }
});
console.log('Replaced in components');
