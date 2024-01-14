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
}

module.exports = nextConfig
