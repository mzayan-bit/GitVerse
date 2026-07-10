import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Transpile Three.js ecosystem packages for proper module resolution
  transpilePackages: ['three', 'maath'],
};

export default nextConfig;
