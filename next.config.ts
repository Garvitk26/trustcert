import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: ['stellar.expert', 'horizon-testnet.stellar.org'],
    remotePatterns: [
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

