import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — GitHub Pages serves pre-rendered files only.
  output: "export",
  // The site lives at https://testplay-byte.github.io/AIO-STUFF/
  basePath: "/AIO-STUFF",
  // Static export can't run the image optimization server.
  images: { unoptimized: true },
  // Emit /index.html for every route so Pages serves them at directory URLs.
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
