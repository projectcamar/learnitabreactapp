/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['od.lk'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'od.lk',
      },
    ],
  },
}

module.exports = nextConfig
