import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    localPatterns: [
      {
        pathname: "/api/uploads/**",
      },
      {
        pathname: "/brand/**",
      },
    ],
  },
};

export default nextConfig;
