import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable all development indicators including the Next.js logo
  devIndicators: false,
  // Enable standalone output for Docker (only in production)
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
};

export default nextConfig;
