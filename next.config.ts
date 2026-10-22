import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  turbopack: {},

  images: {
    domains: [
      "oss-cf.cjdropshipping.com",
      "cf.cjdropshipping.com",
      "cbu01.alicdn.com",
      "cdn.shopify.com",
      "embed.figma.com",
    ],
    qualities: [75, 90, 95],
  },
};

export default nextConfig;
