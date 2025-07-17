import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// next.config.js
module.exports = {
  images: {
    domains: ['lh3.googleusercontent.com', 's.gravatar.com', 'your-auth0-domain.com'], // add domains here
  },
};


export default nextConfig;

