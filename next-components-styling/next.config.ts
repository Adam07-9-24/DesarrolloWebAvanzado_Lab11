import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": [
        {
          condition: { path: /\.module\.css$/ },
          loaders: ["@tailwindcss/turbopack"],
          as: "*.module.css",
          type: "css-module",
        },
        {
          condition: { path: /^(?!.*\.module\.css$).*\.css$/ },
          loaders: ["@tailwindcss/turbopack"],
          as: "*.css",
          type: "css",
        },
      ],
    },
  },
};

export default nextConfig;
