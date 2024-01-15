/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  swcMinify: true,

  rewrites: () => [
    {
      source: "/recipes",
      destination: "/recipes?filter=all",
    },
  ],
};

module.exports = nextConfig;
