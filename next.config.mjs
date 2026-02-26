/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; font-src 'self' 'unsafe-inline' data: blob: https://fonts.gstatic.com https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.grammarly.com https://grammarly.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' 'unsafe-inline' data: https:; connect-src 'self' https: wss:; frame-src 'self' https://vercel.live;",
          },
        ],
      },
    ]
  },
}

export default nextConfig
