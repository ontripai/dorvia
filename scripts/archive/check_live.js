const urls = [
  'https://romania-git-dre-p00-base-t01-r01-ontrip.vercel.app/needs/driving-license',
  'https://romania-git-dre-p00-base-t01-r01-ontrip.vercel.app/fa/needs/driving-license',
  'https://romania-git-dre-p00-base-t01-r01-ontrip.vercel.app/work/work-permit',
  'https://romania-git-dre-p00-base-t01-r01-ontrip.vercel.app/fa/work/work-permit',
  'https://romania-git-dre-p00-base-t01-r01-ontrip.vercel.app/romania/cities',
  'https://romania-git-dre-p00-base-t01-r01-ontrip.vercel.app/fa/romania/cities',
  'https://romania-git-dre-p00-base-t01-r01-ontrip.vercel.app/robots.txt',
  'https://romania-git-dre-p00-base-t01-r01-ontrip.vercel.app/sitemap.xml',
  'https://romania-git-dre-p00-base-t01-r01-ontrip.vercel.app/cities',
  'https://romania-git-dre-p00-base-t01-r01-ontrip.vercel.app/work/permit',
  'https://romania-git-dre-p00-base-t01-r01-ontrip.vercel.app/admin/comments'
];

async function check() {
  for (const url of urls) {
    try {
      const r = await fetch(url, { redirect: 'manual' });
      const text = await r.text();
      console.log('\n[' + r.status + '] ' + url);
      
      if (url.includes('robots.txt')) {
         console.log(text.trim());
      } else if (url.includes('sitemap.xml')) {
         const count = (text.match(/<url>/g) || []).length;
         console.log('Sitemap URLs: ' + count);
      } else if (r.status === 200) {
         const title = text.match(/<title[^>]*>(.*?)<\/title>/)?.[1] || '';
         const descMatch = text.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/);
         const desc = descMatch ? descMatch[1] : '';
         const h1Match = text.match(/<h1[^>]*>(.*?)<\/h1>/);
         const h1 = h1Match ? h1Match[1] : '';
         const canonicalMatch = text.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/);
         const canonical = canonicalMatch ? canonicalMatch[1] : '';
         const ogTitleMatch = text.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/);
         const ogTitle = ogTitleMatch ? ogTitleMatch[1] : '';
         const robotsMatch = text.match(/<meta[^>]*name="robots"[^>]*content="([^"]*)"/);
         const robots = robotsMatch ? robotsMatch[1] : '';
         
         console.log('Title: ' + title);
         console.log('Desc: ' + desc);
         console.log('H1: ' + h1);
         console.log('Canonical: ' + canonical);
         console.log('OG Title: ' + ogTitle);
         console.log('Robots: ' + robots);
      }
    } catch (e) {
      console.error(e.message);
    }
  }
}
check();
