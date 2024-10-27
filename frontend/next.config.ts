import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["cdn.marvel.com", "img.freepik.com"],
  },
};

export default nextConfig;
