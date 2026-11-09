import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // The repo sits inside a home directory that has its own lockfile; pin the root.
  outputFileTracingRoot: path.join(__dirname),
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
