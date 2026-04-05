import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  compress: true, // Enable gzip/brotli compression
};

export default nextConfig;
