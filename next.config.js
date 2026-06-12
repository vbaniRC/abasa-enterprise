/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
  images: {
    domains: ["grvomwpejsgokxcandkr.supabase.co"],
  },
};

module.exports = nextConfig;
