const https = require('https');
const http = require('http');

function fetchUrl(urlStr, followRedirects = false) {
  return new Promise((resolve, reject) => {
    const lib = urlStr.startsWith('https') ? https : http;
    const req = lib.get(urlStr, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VerifyBot/1.0'
      }
    }, (res) => {
      if (!followRedirects && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
         resolve({ status: res.statusCode, target: res.headers.location, headers: res.headers });
         return;
      }
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && followRedirects) {
        const nextUrl = new URL(res.headers.location, urlStr).toString();
        fetchUrl(nextUrl, true).then(resolve).catch(reject);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data, headers: res.headers });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

const PREVIEW_URL = 'https://romania-git-dre-p00-base-t01-r01-ontrip.vercel.app';

const urlsToTest = [
  '/',
  '/about',
  '/contact',
  '/work',
  '/work/find-job',
  '/work/finding-job',
  '/work/permit',
  '/work/work-permit',
  '/work/visa',
  '/work/work-visa',
  '/work/contract',
  '/work/employment-contract',
  '/work/tax',
  '/work/taxes-salaries',
  '/needs/healthcare',
  '/needs/health',
  '/needs/sim-internet',
  '/needs/telecom',
  '/needs/first-days-checklist',
  '/romania/culture',
  '/romania/culture-and-arts',
  '/cities',
  '/romania/cities',
  '/legal',
  '/legal/privacy',
  '/legal/terms',
  '/legal/disclaimer',
  '/evaluation',
  '/admin/comments',
  '/sitemap.xml',
  '/robots.txt'
];

async function runTests() {
  const results = [];
  for (const path of urlsToTest) {
    const fullUrl = PREVIEW_URL + path;
    try {
      const result = await fetchUrl(fullUrl, false); // no follow redirects
      let canonical = 'MISSING';
      let robots = 'MISSING';
      let title = 'MISSING';
      let h1 = 'MISSING';
      
      if (result.status === 200 && result.data) {
        const canMatch = result.data.match(/<link rel="canonical" href="([^"]+)"/);
        if (canMatch) canonical = canMatch[1];
        
        const robMatch = result.data.match(/<meta name="robots" content="([^"]+)"/);
        if (robMatch) robots = robMatch[1];
        
        const titleMatch = result.data.match(/<title[^>]*>([^<]+)<\/title>/);
        if (titleMatch) title = titleMatch[1];
        
        const h1Match = result.data.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
        if (h1Match) h1 = h1Match[1].replace(/<[^>]+>/g, '').trim();
      }
      
      results.push({
        path,
        status: result.status,
        target: result.target || 'N/A',
        canonical,
        robots,
        title,
        h1
      });
      console.log(`[${result.status}] ${path} ${result.target ? '-> ' + result.target : ''}`);
    } catch(e) {
      console.log(`ERROR on ${path}: ${e.message}`);
    }
  }
  const fs = require('fs');
  fs.writeFileSync('verify_results.json', JSON.stringify(results, null, 2));
}

runTests();
