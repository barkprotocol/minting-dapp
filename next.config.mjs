import path from 'path';

const nextConfig = {
  images: {
    domains: ['uploadcare.com', 'flaticon.com'],
  },
  env: {
    HELIUS_API_URL: process.env.HELIUS_API_URL,
  },
  webpack(config) {
    config.resolve.alias['@'] = path.resolve('src');
    return config;
  },
};

export default nextConfig;
