const https = require('https');

const PREVIEW_URL = 'https://romania-git-dre-p00-base-t01-r01-ontrip.vercel.app/sitemap.xml';

https.get(PREVIEW_URL, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const urls = [...data.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    const fs = require('fs');
    fs.writeFileSync('verify_sitemap.json', JSON.stringify({ urls }, null, 2));
    console.log('Sitemap URL count:', urls.length);
  });
});
