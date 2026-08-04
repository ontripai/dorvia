const http = require('http');
const https = require('https');

const PREVIEW_URL = 'https://romania-git-dre-p00-base-t01-r01-ontrip.vercel.app';

async function fetchUrl(urlPath) {
  const url = `${PREVIEW_URL}${urlPath}`;
  const options = {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  };
  return new Promise((resolve, reject) => {
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function verify() {
  console.log(`Verifying: ${PREVIEW_URL}`);
  try {
    // 2. Verify robots.txt
    const robotsRes = await fetchUrl('/robots.txt');
    console.log(`\n--- /robots.txt ---`);
    console.log(`Status: ${robotsRes.status}`);
    console.log(`Content:\n${robotsRes.data}`);

    // 3. Verify Preview HTML robots metadata
    const paths = [
      '/',
      '/legal/privacy',
      '/legal/terms',
      '/legal/disclaimer',
      '/evaluation',
      '/work/work-permit',
      '/romania/cities'
    ];
    console.log(`\n--- HTML robots metadata ---`);
    for (const p of paths) {
      const res = await fetchUrl(p);
      const hasNoIndex = res.data.includes('noindex');
      const hasNoFollow = res.data.includes('nofollow');
      console.log(`${p} -> Status: ${res.status}, noindex: ${hasNoIndex}, nofollow: ${hasNoFollow}`);
    }

    // 4. Verify sitemap
    console.log(`\n--- /sitemap.xml ---`);
    const sitemapRes = await fetchUrl('/sitemap.xml');
    console.log(`Status: ${sitemapRes.status}`);
    const urls = [...sitemapRes.data.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
    console.log(`Total URLs: ${urls.length}`);

    // 5. Verify required route behaviour
    const checkRoutes = [
      '/cities',
      '/romania/cities',
      '/work/permit',
      '/work/work-permit',
      '/needs/healthcare',
      '/needs/health',
      '/romania/culture',
      '/romania/culture-and-arts',
      '/legal',
      '/legal/privacy',
      '/evaluation',
      '/admin/comments'
    ];
    console.log(`\n--- Route HTTP Statuses ---`);
    for (const r of checkRoutes) {
      const res = await fetchUrl(r);
      console.log(`${r} -> Status: ${res.status}`);
    }

    // 6. Verify corrected metadata
    console.log(`\n--- Specific Metadata ---`);
    for (const p of ['/work/work-permit', '/romania/cities']) {
      const res = await fetchUrl(p);
      const titleMatch = res.data.match(/<title>(.*?)<\/title>/);
      const descMatch = res.data.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/);
      const h1Match = res.data.match(/<h1[^>]*>(.*?)<\/h1>/);
      const canonicalMatch = res.data.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"[^>]*>/);
      const ogTitleMatch = res.data.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/);
      const ogDescMatch = res.data.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/);
      console.log(`Path: ${p}`);
      console.log(`  Title: ${titleMatch ? titleMatch[1] : 'NOT FOUND'}`);
      console.log(`  Meta Desc: ${descMatch ? descMatch[1] : 'NOT FOUND'}`);
      console.log(`  H1: ${h1Match ? h1Match[1].replace(/<[^>]+>/g, '') : 'NOT FOUND'}`);
      console.log(`  Canonical: ${canonicalMatch ? canonicalMatch[1] : 'NOT FOUND'}`);
      console.log(`  OG Title: ${ogTitleMatch ? ogTitleMatch[1] : 'NOT FOUND'}`);
      console.log(`  OG Desc: ${ogDescMatch ? ogDescMatch[1] : 'NOT FOUND'}`);
    }

    // 7. Verify Start Here preservation
    console.log(`\n--- Start Here Content Preservation ---`);
    for (const p of ['/start-here/planning-to-come', '/start-here/newly-arrived', '/start-here/settling-in']) {
      const res = await fetchUrl(p);
      const hasH3 = res.data.includes('<h3 class="text-2xl font-bold');
      console.log(`${p} -> Preserved Sections Present: ${hasH3}`);
    }

    const firstDaysRes = await fetchUrl('/needs/first-days-checklist');
    console.log(`/needs/first-days-checklist -> Status: ${firstDaysRes.status}`);

  } catch (err) {
    console.error('Error verifying deploy:', err);
  }
}

verify();
