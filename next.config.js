/** @type {import('next').NextStyleConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'your-supabase-project.supabase.co'],
  },
};

module.exports = nextConfig;
