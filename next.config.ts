import type { NextConfig } from "next";

const isTurbo = process.argv.includes('--turbo');

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
  experimental: {
    // any experimental features needed for serverless
  }
};

if (isTurbo) {
  nextConfig.turbopack = {
    resolveAlias: {
      'fs': './lib/empty.ts',
      'net': './lib/empty.ts',
      'tls': './lib/empty.ts',
    },
  };
} else {
  nextConfig.webpack = (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  };
}

export default nextConfig;
