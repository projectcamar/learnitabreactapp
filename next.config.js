/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['*'],
    unoptimized: true
  },
  // Add these configurations
  poweredByHeader: false,
  generateEtags: false,
  distDir: '.next',
  cleanDistDir: true,
  assetPrefix: '',
  compress: true,
  // Ensure proper MIME types
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
        ],
      },
    ]
  }
}

module.exports = nextConfig
