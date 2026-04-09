import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  pageExtensions: ["js", "jsx", "ts", "tsx"],
};

export default nextConfig;
