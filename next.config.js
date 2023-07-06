/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.licdn.com',
      },
      {
        protocol: 'https',
        hostname: 'ca.slack-edge.com',
      },
    ],
  },
};

module.exports = nextConfig;
