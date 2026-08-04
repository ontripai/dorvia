const fs = require('fs');

async function getHtml(url) {
  return new Promise((resolve) => {
    require('https').get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    });
  });
}

const PREVIEW_URL = 'https://romania-git-dre-p00-base-t01-r01-ontrip.vercel.app';
const aliases = [
  '/work/find-job', '/work/permit', '/work/visa', '/work/contract', '/work/tax',
  '/needs/healthcare', '/needs/sim-internet',
  '/romania/culture', '/cities',
  '/start-here/arriving-soon', '/start-here/pre-departure-checklist',
  '/start-here/just-arrived', '/start-here/first-three-days',
  '/start-here/living-here', '/start-here/first-month',
  '/legal'
];

async function scan() {
  const html = await getHtml(PREVIEW_URL + '/');
  let found = 0;
  const matches = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  for (const alias of aliases) {
    if (matches.includes(alias)) {
      console.log('FOUND ALIAS LINK:', alias);
      found++;
    }
  }
  console.log(`Scanned ${matches.length} links on homepage.`);
  console.log(`Alias links found: ${found}`);
  
  // also check /legal/privacy#cookies
  const privacyHtml = await getHtml(PREVIEW_URL + '/legal/privacy');
  console.log('Cookies anchor exists?', privacyHtml.includes('id="cookies"'));
}

scan();
