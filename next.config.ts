import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'stellar.expert',
      },
      {
        protocol: 'https',
        hostname: 'horizon-testnet.stellar.org',
      },
      {
         protocol: 'https',
         hostname: '*.stellar.org',
      },
      {
         protocol: 'https',
         hostname: 'lh3.googleusercontent.com',
      },
      {
         protocol: 'https',
         hostname: 'firebasestorage.googleapis.com',
      }
    ],
  },
  turbopack: {}, // Enable custom webpack logic with Turbopack
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    return config
  },
  experimental: {
    // any experimental features needed for serverless
  }
};

export default nextConfig;

