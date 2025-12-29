import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable all development indicators including the Next.js logo
  devIndicators: false,
  // Enable standalone output for Docker
  output: 'standalone',
};

export default nextConfig;
