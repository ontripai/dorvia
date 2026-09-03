/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

let supabaseHost = '';
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
    supabaseHost = url.protocol + '//' + url.host;
  } catch (e) {
    // Graceful fallback
  }
}
const supabaseConnectSrc = supabaseHost ? ` ${supabaseHost}` : '';

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' ${!isProd ? "'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https://images.unsplash.com;
    font-src 'self' data:;
    connect-src 'self'${supabaseConnectSrc};
    frame-src 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: cspHeader.replace(/\n/g, '').replace(/\s+/g, ' ').trim(),
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  }
];

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return {
      fallback: [],
    };
  },
  async redirects() {
    return [
      {
        source: '/work/find-job',
        destination: '/work/finding-job',
        permanent: true,
      },
      {
        source: '/work/permit',
        destination: '/work/work-permit',
        permanent: true,
      },
      {
        source: '/work/visa',
        destination: '/work/work-visa',
        permanent: true,
      },
      {
        source: '/work/contract',
        destination: '/work/employment-contract',
        permanent: true,
      },
      {
        source: '/work/tax',
        destination: '/work/taxes-salaries',
        permanent: true,
      },
      {
        source: '/needs/healthcare',
        destination: '/needs/health',
        permanent: true,
      },
      {
        source: '/needs/sim-internet',
        destination: '/needs/telecom',
        permanent: true,
      },
      {
        source: '/romania/culture',
        destination: '/romania/culture-and-arts',
        permanent: true,
      },
      {
        source: '/cities',
        destination: '/romania/cities',
        permanent: true,
      },
      {
        source: '/start-here/arriving-soon',
        destination: '/start-here/planning-to-come',
        permanent: true,
      },
      {
        source: '/start-here/pre-departure-checklist',
        destination: '/start-here/planning-to-come',
        permanent: true,
      },
      {
        source: '/start-here/just-arrived',
        destination: '/start-here/newly-arrived',
        permanent: true,
      },
      {
        source: '/start-here/first-three-days',
        destination: '/start-here/newly-arrived',
        permanent: true,
      },
      {
        source: '/start-here/living-here',
        destination: '/start-here/settling-in',
        permanent: true,
      },
      {
        source: '/start-here/first-month',
        destination: '/start-here/settling-in',
        permanent: true,
      },
      {
        source: '/legal',
        destination: '/legal/privacy',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
