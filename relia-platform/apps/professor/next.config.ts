import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Transpile workspace packages
  transpilePackages: [
    '@relia/domain',
    '@relia/db',
    '@relia/ui',
    '@relia/validation',
    '@relia/config',
  ],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org',
        pathname: '/b/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/wikipedia/commons/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
