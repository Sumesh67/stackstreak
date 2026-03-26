import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip pre-rendering errors for pages that require runtime env vars
  typescript: { ignoreBuildErrors: false },
  // Use standalone output for easy deployment
  output: "standalone",
};

export default nextConfig;
