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
  // Add this to see more detailed error messages during build
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      config.infrastructureLogging = {
        level: 'verbose',
      }
    }
    return config
  },
}

module.exports = nextConfig
