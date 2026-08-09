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
    // Local files under /public/uploads are served as static assets;
    // no remotePatterns entry needed for `/uploads/...` paths.
  },
};

export default nextConfig;
