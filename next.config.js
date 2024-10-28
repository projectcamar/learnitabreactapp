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
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
