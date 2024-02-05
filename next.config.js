/** @type {import('next').NextConfig} */
const nextConfig = {
  //代理重定向到后台服务
  async rewrites() {
    return {
      fallback: [
        {
          source: "/api/system/user",
          destination: `http://localhost:8080/system/user/`,
        },
        {
          source: "/api/:path*",
          destination: `http://localhost:8080/:path*`,
        },
      ],
    };
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ["img.shields.io"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.shields.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
