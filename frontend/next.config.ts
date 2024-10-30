import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["cdn.marvel.com", "img.freepik.com"],
  },
  async rewrites() {
    // eslint-disable-next-line no-console
    console.log("gola " + process.env.NEXT_PUBLIC_BACKEND);
    return [
      {
        source: "/socket.io/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND}/socket.io/:path*`,
      },
    ];
  },
};

export default nextConfig;
