import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.intra.42.fr',
        port: '',
        pathname: '/users/7ead081adec12b381793f981d668ef85/asabri.jpg',
        search: '',
      },
    ],
  },
};

export default nextConfig;
