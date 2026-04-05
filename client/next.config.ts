import type { NextConfig } from "next";
import { config } from "dotenv";
import path from "path";

// Load root .env
const envPath = path.resolve(process.cwd(), ".env");
config({ path: envPath, override: false });

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'E-Navbat UZ',
  },
};

export default nextConfig;
