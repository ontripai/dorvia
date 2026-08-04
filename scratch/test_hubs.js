const http = require('http');

const testPage = (url, expectedLinks) => {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`\n=== Testing ${url} (Status: ${res.statusCode}) ===`);
        expectedLinks.forEach(link => {
          const hasLink = data.includes(`href="${link}"`) || data.includes(`href='${link}'`);
          console.log(`Link -> ${link}: ${hasLink ? 'FOUND ✅' : 'NOT FOUND ❌'}`);
        });
        resolve();
      });
    });
  });
};

async function run() {
  await testPage('http://localhost:3009/immigration', [
    '/immigration/igi-process',
    '/immigration/residence-renewal',
    '/immigration/family-reunification',
    '/immigration/long-term-residence',
    '/immigration/citizenship'
  ]);

  await testPage('http://localhost:3009/work', [
    '/work/finding-job',
    '/work/work-permit',
    '/company/registration',
    '/work/taxes-salaries',
    '/work/insurance'
  ]);

  await testPage('http://localhost:3009/study', [
    '/universities',
    '/study/scholarships',
    '/study/preparatory-year',
    '/study/visa-type-d'
  ]);
}

run();
