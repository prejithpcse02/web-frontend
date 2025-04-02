import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "127.0.0.1",
      "localhost",
      "https://web-frontend-w5a4.vercel.app/",
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
