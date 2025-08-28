import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: { ignoreDuringBuilds: true },
  outputFileTracingRoot: process.cwd()
};

export default nextConfig;
