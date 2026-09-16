const apiOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api/v1').origin
  } catch {
    return ''
  }
})()

/**
 * Content-Security-Policy — the backstop behind the server's HTML sanitiser.
 *
 * Shipped as Report-Only: violations appear in the browser console and break
 * nothing. Once a staging walk-through (donate, blog, story, project videos,
 * contact map, admin editor) leaves the console clean, rename the header to
 * `Content-Security-Policy` to enforce it.
 *
 * script-src keeps 'unsafe-inline' because Next.js emits inline bootstrap
 * scripts; removing it needs per-request nonces from middleware. Even so, the
 * policy blocks scripts from any other origin, plugins, <base> hijacking and
 * cross-site form posts.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'"} https://player.vimeo.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' blob: https:",
  `connect-src 'self' ${apiOrigin}`.trim(),
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://maps.google.com https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Donate result pages can load inside SSLCommerz's checkout (see BreakIframe).
  "frame-ancestors 'self' https://*.sslcommerz.com",
].join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy-Report-Only', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=()' },
        ],
      },
    ]
  },
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
      // Members was the Users list filtered to the foundation register.
      {
        source: '/admin/members',
        destination: '/admin/users?role=MEMBER',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
