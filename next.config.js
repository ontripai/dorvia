/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'your-supabase-project.supabase.co'],
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:locale(fa|en)/:path(articles|company|immigration|needs|romania|services|start-here|study|universities|work)',
          destination: '/:path',
        },
        {
          source: '/:locale(fa|en)/:path(articles|company|immigration|needs|romania|services|start-here|study|universities|work)/:slug*',
          destination: '/:path/:slug*',
        },
      ],
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
