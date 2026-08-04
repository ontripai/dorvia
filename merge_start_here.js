const fs = require('fs');

let code = fs.readFileSync('src/components/StartHereContent.tsx', 'utf8');

function extractGrid(caseName) {
  const startStr = `case '${caseName}':`;
  const startIndex = code.indexOf(startStr);
  if (startIndex === -1) return null;
  const nextCaseIndex = code.indexOf('case ', startIndex + 10);
  const endOfSwitch = code.lastIndexOf('}');
  const endIndex = nextCaseIndex !== -1 ? nextCaseIndex : endOfSwitch;
  const body = code.slice(startIndex, endIndex);
  
  const match = body.match(/<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">([\s\S]*?)<\/div>\s*<div className="mt-12 bg-\[\#F8FAFC\]/);
  return match ? match[1] : null;
}

const preDepGrid = extractGrid('pre-departure-checklist');
const f3dGrid = extractGrid('first-three-days');
const fMonthGrid = extractGrid('first-month');

function insertGridIntoCase(caseName, gridHtml, headingFa, headingEn) {
  if (!gridHtml) return;
  const startStr = `case '${caseName}':`;
  const startIndex = code.indexOf(startStr);
  if (startIndex === -1) return;
  
  const faqStr = `<div className="mt-12 bg-[#F8FAFC]`;
  const faqIndex = code.indexOf(faqStr, startIndex);
  if (faqIndex === -1) return;
  
  const insertion = `
          <h3 className="text-2xl font-bold text-[#142033] mt-12 mb-6 px-2">{currentLang === 'fa' ? '${headingFa}' : '${headingEn}'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${gridHtml.trim()}
          </div>
          
          `;
          
  code = code.slice(0, faqIndex) + insertion + code.slice(faqIndex);
}

insertGridIntoCase('planning-to-come', preDepGrid, 'چک‌لیست نهایی پیش از سفر', 'Final Pre-departure Checklist');
insertGridIntoCase('newly-arrived', f3dGrid, 'راهنمای ۷۲ ساعت نخست', 'First 72 Hours Guide');
insertGridIntoCase('settling-in', fMonthGrid, 'اقدامات ضروری ماه اول', 'Essential First-Month Actions');

// Now remove the old cases
function removeCase(caseName) {
  const startStr = `    case '${caseName}':`;
  const startIndex = code.indexOf(startStr);
  if (startIndex === -1) return;
  let nextCaseIndex = code.indexOf('    case ', startIndex + 10);
  if (nextCaseIndex === -1) {
     nextCaseIndex = code.indexOf('    default:', startIndex);
  }
  if (nextCaseIndex === -1) {
     nextCaseIndex = code.lastIndexOf('  }');
  }
  
  code = code.slice(0, startIndex) + code.slice(nextCaseIndex);
}

removeCase('pre-departure-checklist');
removeCase('first-three-days');
removeCase('first-month');

fs.writeFileSync('src/components/StartHereContent.tsx', code, 'utf8');
console.log('Successfully merged content and removed dead cases.');
