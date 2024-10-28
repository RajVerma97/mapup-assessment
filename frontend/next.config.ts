import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["cdn.marvel.com", "img.freepik.com"],
  },
  async rewrites() {
    return [
      {
        source: "/socket.io/:path*",
        destination: "http://localhost:5001/socket.io/:path*",
      },
    ];
  },
};

export default nextConfig;
