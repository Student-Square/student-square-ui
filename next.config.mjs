/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emits .next/standalone with a self-contained server.js — what the
  // Dockerfile copies, and what `npm start` already assumed.
  output: 'standalone',
  typescript: {
    // Type errors do not fail the build. CI runs `npm run typecheck`
    // separately so they still block a merge.
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/stories',
        destination: '/blog/real-life-stories',
        permanent: true,
      },
      {
        source: '/stories/:id',
        destination: '/blog/real-life-stories/:id',
        permanent: true,
      },
      // Press duplicated /news off the same coverage list; /news is the one page now.
      {
        source: '/about/press',
        destination: '/news',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
