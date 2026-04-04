import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // We handle this via the IDE for better performance
    ignoreBuildErrors: true,
  },
  eslint: {
    // We handle this via the IDE for better performance
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'erp.rkgit.edu.in',
      },
      {
        protocol: 'https',
        hostname: 'rkgit.edu.in',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Suppress the warning while keeping the build-time optimizations
  devIndicators: {
    appIsrStatus: false,
  },
};

export default nextConfig;
