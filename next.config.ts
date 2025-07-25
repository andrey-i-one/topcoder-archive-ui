/**
 * @type {import('next').NextConfig}
 */
require("dotenv").config

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  output: "standalone",
  env: {
    API_URL: process.env.API_URL
  }
};

export default nextConfig;
