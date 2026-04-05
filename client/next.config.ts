import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  compress: true,
  devIndicators: false as any,
};

export default nextConfig;
