/**
 * @type {import('next').NextConfig}
 */
require("dotenv").config

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  output: "standalone",
};

export default nextConfig;
