const fs = require('fs');
const path = require('path');

const replacements = {
  '/work/find-job': '/work/finding-job',
  '/work/permit': '/work/work-permit',
  '/work/visa': '/work/work-visa',
  '/work/contract': '/work/employment-contract',
  '/work/tax': '/work/taxes-salaries',
  '/needs/healthcare': '/needs/health',
  '/needs/sim-internet': '/needs/telecom',
  '/romania/culture': '/romania/culture-and-arts',
  // Be careful with /cities so it doesn't replace /romania/cities
  // It's mostly href="/cities"
  'href="/cities"': 'href="/romania/cities"',
  "href='/cities'": "href='/romania/cities'",
  "`/cities`": "`/romania/cities`",
  '/start-here/arriving-soon': '/start-here/planning-to-come',
  '/start-here/pre-departure-checklist': '/start-here/planning-to-come',
  '/start-here/just-arrived': '/start-here/newly-arrived',
  '/start-here/first-three-days': '/start-here/newly-arrived',
  '/start-here/living-here': '/start-here/settling-in',
  '/start-here/first-month': '/start-here/settling-in',
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  for (const [oldVal, newVal] of Object.entries(replacements)) {
    if (oldVal === 'href="/cities"' || oldVal === "href='/cities'" || oldVal === "`/cities`") {
       if (content.includes(oldVal)) {
           content = content.split(oldVal).join(newVal);
           changed = true;
       }
    } else {
      // Need to avoid replacing /romania/culture-and-arts if we search for /romania/culture
      // We'll replace oldVal followed by quote or hashtag or query
      const regex = new RegExp(oldVal + '([#"\\\'\\]\\`\\?])', 'g');
      if (regex.test(content)) {
        content = content.replace(regex, newVal + '$1');
        changed = true;
      }
      
      // Also check exact string literal like 'work/visa' if not absolute? No, most are absolute.
      const relativeOldVal = oldVal.substring(1);
      const relativeRegex = new RegExp("['\\\"\\`]" + relativeOldVal + "['\\\"\\`]", 'g');
      if (relativeRegex.test(content)) {
        content = content.replace(relativeRegex, (match) => match[0] + newVal.substring(1) + match[match.length-1]);
        changed = true;
      }
    }
  }
  
  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated ' + f);
  }
});
