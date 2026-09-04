const fs = require('fs');

const redirectsList = [
  { source: '/work/find-job', destination: '/work/finding-job' },
  { source: '/work/permit', destination: '/work/work-permit' },
  { source: '/work/visa', destination: '/work/work-visa' },
  { source: '/work/contract', destination: '/work/employment-contract' },
  { source: '/work/tax', destination: '/work/taxes-salaries' },
  { source: '/needs/healthcare', destination: '/needs/health' },
  { source: '/needs/sim-internet', destination: '/needs/telecom' },
  { source: '/romania/culture', destination: '/romania/culture-and-arts' },
  { source: '/cities', destination: '/romania/cities' },
  { source: '/start-here/arriving-soon', destination: '/start-here/planning-to-come' },
  { source: '/start-here/pre-departure-checklist', destination: '/start-here/planning-to-come' },
  { source: '/start-here/just-arrived', destination: '/start-here/newly-arrived' },
  { source: '/start-here/first-three-days', destination: '/start-here/newly-arrived' },
  { source: '/start-here/living-here', destination: '/start-here/settling-in' },
  { source: '/start-here/first-month', destination: '/start-here/settling-in' },
  { source: '/legal', destination: '/legal/privacy' }
];

const redirectsCode = `
  async redirects() {
    return [
${redirectsList.map(r => `      {
        source: '${r.source}',
        destination: '${r.destination}',
        permanent: true,
      },`).join('\n')}
    ];
  },
`;

const configContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'your-supabase-project.supabase.co'],
  },${redirectsCode}};

module.exports = nextConfig;
`;

fs.writeFileSync('next.config.js', configContent, 'utf8');
console.log('Updated next.config.js');
