import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  }
};

module.exports = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default nextConfig;
