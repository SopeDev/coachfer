/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Optimize images for Vercel
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable compression
  compress: true,

  // Optimize production builds
  swcMinify: true,

  // Power by header (optional - remove Vercel branding)
  poweredByHeader: false,
}

module.exports = nextConfig
