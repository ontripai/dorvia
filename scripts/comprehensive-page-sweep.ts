import http from 'http';
import { spawn, ChildProcess } from 'child_process';
import { ROUTE_REGISTRY } from '../src/lib/routeRegistry';

const PORT = 3005;
const BASE_URL = `http://127.0.0.1:${PORT}`;

interface AuditResult {
  route: string;
  lang: 'fa' | 'en';
  status: number;
  hasTitle: boolean;
  hasH1: boolean;
  brokenImgAlts: number;
  placeholderMatches: string[];
  undefinedLinks: string[];
  ok: boolean;
}

async function waitForServer(url: string, timeoutMs: number = 30000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status < 500) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server did not respond at ${url} within ${timeoutMs}ms`);
}

async function runSweep() {
  console.log('🚀 Starting Next.js production server on port', PORT);
  const serverProc: ChildProcess = spawn(
    'npx',
    ['next', 'start', '-p', String(PORT)],
    {
      stdio: 'pipe',
      shell: true,
      env: { ...process.env, PORT: String(PORT), NODE_ENV: 'production' },
    }
  );

  serverProc.stdout?.on('data', (d) => {
    // console.log(`[server stdout] ${d}`);
  });
  serverProc.stderr?.on('data', (d) => {
    // console.error(`[server stderr] ${d}`);
  });

  try {
    await waitForServer(`${BASE_URL}/fa`);
    console.log('✅ Next.js production server is active on port', PORT);

    // 1. Test 301 Canonical Redirect from *.vercel.app
    console.log('\n--- Test 1: Testing Canonical Domain 301 Redirect for *.vercel.app ---');
    const redirectTest = await new Promise<{ status: number; location: string | null }>((resolve) => {
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: PORT,
          path: '/fa/romania',
          headers: {
            'x-forwarded-host': 'dorvia.vercel.app',
          },
        },
        (res) => {
          resolve({ status: res.statusCode || 0, location: (res.headers.location as string) || null });
        }
      );
      req.end();
    });
    console.log('Vercel host response status:', redirectTest.status);
    console.log('Redirect location:', redirectTest.location);
    const redirectPassed = redirectTest.status === 301 && redirectTest.location === 'https://dorvia.ro/fa/romania';
    console.log('Canonical 301 Redirect test passed:', redirectPassed);

    // 2. Iterate all canonical routes from ROUTE_REGISTRY
    console.log('\n--- Test 2: Full Site Sweep across all canonical routes ---');
    const canonicalRoutes = Object.values(ROUTE_REGISTRY)
      .filter((r) => r.canonical !== '/work/job-requests')
      .map((r) => r.canonical);
    const results: AuditResult[] = [];

    for (const route of canonicalRoutes) {
      for (const lang of ['fa', 'en'] as const) {
        const cleanPath = route === '/' ? '' : route;
        const fullPath = `/${lang}${cleanPath}`;
        const url = `${BASE_URL}${fullPath}`;

        try {
          const res = await fetch(url);
          const html = await res.text();

          // Title
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          const title = titleMatch ? titleMatch[1].trim() : '';
          const hasTitle = Boolean(title && !title.toLowerCase().includes('undefined'));

          // H1
          const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
          const hasH1 = Boolean(h1Match);

          // Img without alt
          const imgMatches = html.match(/<img[^>]+>/g) || [];
          let brokenImgAlts = 0;
          for (const imgTag of imgMatches) {
            if (!imgTag.includes('alt=') || /alt=["']\s*["']/.test(imgTag)) {
              console.log(`[Sweep Note] Empty/missing alt in ${fullPath}:`, imgTag);
              brokenImgAlts++;
            }
          }

          // Undefined in links
          const linkMatches = html.match(/href=["']([^"']+)["']/g) || [];
          const undefinedLinks: string[] = [];
          for (const l of linkMatches) {
            if (l.includes('undefined')) {
              undefinedLinks.push(l);
            }
          }

          // Placeholders
          const placeholderMatches: string[] = [];
          if (/lorem\s+ipsum/i.test(html)) placeholderMatches.push('lorem ipsum');
          if (/\bTODO\b/.test(html)) placeholderMatches.push('TODO');
          if (/\bFIXME\b/.test(html)) placeholderMatches.push('FIXME');
          if (/\bComing soon\b/i.test(html)) placeholderMatches.push('Coming soon');

          const ok =
            res.status === 200 &&
            hasTitle &&
            brokenImgAlts === 0 &&
            undefinedLinks.length === 0 &&
            placeholderMatches.length === 0;

          results.push({
            route: fullPath,
            lang,
            status: res.status,
            hasTitle,
            hasH1,
            brokenImgAlts,
            placeholderMatches,
            undefinedLinks,
            ok,
          });
        } catch (err: any) {
          results.push({
            route: fullPath,
            lang,
            status: 0,
            hasTitle: false,
            hasH1: false,
            brokenImgAlts: 0,
            placeholderMatches: [],
            undefinedLinks: [],
            ok: false,
          });
        }
      }
    }

    const totalTested = results.length;
    const passed = results.filter((r) => r.ok).length;
    const failed = results.filter((r) => !r.ok);

    console.log(`\n========================================`);
    console.log(`PAGE SWEEP SUMMARY:`);
    console.log(`Total Pages Tested: ${totalTested}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed.length}`);
    console.log(`========================================\n`);

    if (failed.length > 0) {
      console.log('Issues found:');
      for (const f of failed) {
        console.log(`- ${f.route}: status=${f.status}, brokenImgAlts=${f.brokenImgAlts}, undefinedLinks=${f.undefinedLinks.join(',')}, placeholders=${f.placeholderMatches.join(',')}`);
      }
    } else {
      console.log('🎉 100% of tested pages passed all checks without any issues!');
    }
  } finally {
    if (serverProc.pid) {
      try {
        require('child_process').execSync(`taskkill /F /T /PID ${serverProc.pid}`, { stdio: 'ignore' });
      } catch {}
    }
  }
}

runSweep()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    if (err?.code === 'ECONNRESET') {
      process.exit(0);
    }
    console.error('Sweep script error:', err);
    process.exit(1);
  });
