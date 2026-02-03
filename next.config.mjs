/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Catch TypeScript errors during build - don't ignore them
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    staticGenerationRetryCount: 1,
  },
  // Disable swcMinify to ensure stable builds
  swcMinify: true,
  reactStrictMode: true,
}

export default nextConfig
