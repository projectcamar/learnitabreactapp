/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Add this to ensure API routes are treated as serverless functions
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
