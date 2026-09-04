const http = require('http');

function checkUrl(url, expectedHrefs) {
  http.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('--- Checking:', url, '(Status:', res.statusCode, ') ---');
      expectedHrefs.forEach(h => {
        const hasHref = data.includes(`href="${h}"`) || data.includes(`href='${h}'`);
        console.log(h, '->', hasHref ? 'FOUND REAL HREF ✅' : 'NOT FOUND ❌');
      });
    });
  });
}

checkUrl('http://localhost:3006/needs', [
  '/needs/first-days-checklist',
  '/needs/currency-exchange',
  '/needs/housing',
  '/needs/driving-license',
  '/needs/certified-translation',
  '/needs/notary-public',
  '/needs/iranian-embassy-and-mikhak',
  '/needs/health',
  '/needs/school',
  '/needs/telecom'
]);

setTimeout(() => {
  checkUrl('http://localhost:3006/romania', [
    '/romania/economy',
    '/romania/society',
    '/romania/culture-and-arts',
    '/romania/laws-and-regulations',
    '/romania/cities',
    '/romania/tourism'
  ]);
}, 500);
