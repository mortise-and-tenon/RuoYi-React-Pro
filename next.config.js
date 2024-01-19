/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    transpilePackages: [
      "@douyinfe/semi-ui",
      "@douyinfe/semi-icons",
      "@douyinfe/semi-illustrations",
    ],
    //代理重定向到后台服务
    async rewrites() {
      return {
        fallback: [
          {
            source: "/api/:path*",
            destination: `http://localhost:8080/:path*`,
          },
        ],
      };
    },
  };
  
  module.exports = nextConfig;