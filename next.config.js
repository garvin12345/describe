/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  // Enable image optimization
  images: {
    domains: ['your-domain.com'], // Add your image domains here
    minimumCacheTTL: 60,
  },
  // Production optimizations
  swcMinify: true,
  reactStrictMode: true,
  // Compression
  compress: true,
};

module.exports = nextConfig; 