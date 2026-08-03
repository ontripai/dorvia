const fs = require('fs');
const path = require('path');

const routesToVerify = [
  '/work',
  '/work/find-job',
  '/work/permit',
  '/work/visa',
  '/work/contract',
  '/work/tax',
  '/work/insurance',
  '/company',
  '/company/registration',
  '/company/tax-types',
  '/company/bank-account',
  '/company/residency',
  '/company/real-estate-investment',
  '/company/startup-tech-investment',
  '/company/annual-tax-reporting'
];

const appDir = path.join(__dirname, '..', 'src', 'app');

console.log('Verifying 15 Work & Business routes existence in App Router...');

let missing = false;

routesToVerify.forEach(route => {
  let relativePath = route.substring(1); // remove leading slash
  let pagePath = path.join(appDir, relativePath, 'page.tsx');
  let slugPagePath = path.join(appDir, relativePath.split('/')[0], '[slug]', 'page.tsx');
  
  if (fs.existsSync(pagePath) || fs.existsSync(slugPagePath)) {
    console.log(`✓ Route ${route} -> FOUND`);
  } else {
    console.error(`❌ Route ${route} -> MISSING`);
    missing = true;
  }
});

if (missing) {
  process.exit(1);
} else {
  console.log('\n✅ All 15 Work & Business routes successfully verified!');
}
