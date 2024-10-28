/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['*'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'od.lk',
      },
      // Add other specific domains you use
    ],
    unoptimized: false, // Remove this unless absolutely necessary
    dangerouslyAllowSVG: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
}

module.exports = nextConfig
