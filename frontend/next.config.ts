// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  exportPathMap: () => ({
    "/": { page: "/" },
  }),
};

export default nextConfig;
