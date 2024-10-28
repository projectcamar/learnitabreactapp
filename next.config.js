/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'od.lk',
      'e7.pngegg.com',
      'images.glints.com',
      'upload.wikimedia.org',
      'media.licdn.com',
      'www.linkedin.com',
      'instagram.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    // During development you can set this to false
    ignoreBuildErrors: false,
  },
  // Ensure Next.js uses SWC for faster builds
  swcMinify: true,
}

module.exports = nextConfig
