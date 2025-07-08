/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
  output: 'standalone',
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Configure path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };

    // Handle node: protocol imports
    config.resolve.fallback = {
      ...config.resolve.fallback,
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      util: require.resolve('util/'),
      path: require.resolve('path-browserify'),
    };

    // Exclude firebase-admin from client-side bundles
    if (!isServer) {
      config.resolve.alias['firebase-admin'] = false;
    }

    // Handle private class fields in undici
    config.module.rules.push({
      test: /\.m?js$/,
      include: /node_modules\/undici/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { targets: "defaults" }]
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-private-methods',
            '@babel/plugin-proposal-private-property-in-object'
          ]
        }
      }
    });

    return config;
  }
};

module.exports = nextConfig;
