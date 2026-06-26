import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:8089/api/v1/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "http://localhost:8089/uploads/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8089",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
