import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        serverActions: {
            bodySizeLimit: "5mb",
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ui-avatars.com",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "5000",
                pathname: "/uploads/**",
            },
            {
                protocol: "https",
                hostname: "web-production-cab83.up.railway.app",
                pathname: "/uploads/**",
            },
        ],
    },
};

export default nextConfig;
