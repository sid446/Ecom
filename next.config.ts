import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com"], // allow Unsplash images
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ allow build even if ESLint errors exist
  },
};

export default nextConfig;
