import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.intra.42.fr',
        port: '',
        pathname: '/users/**',
        search: '',
      },
    ],
    domains: ['i.ibb.co'], // Add the domain(s) you want to allow
  },
};

export default nextConfig;