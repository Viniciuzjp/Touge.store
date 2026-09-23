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

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
