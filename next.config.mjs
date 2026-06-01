/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
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
    ]
  },
}

export default nextConfig
