/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/flow-clock',
  assetPrefix: '/flow-clock/',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/flow-clock',
  },
}

module.exports = nextConfig
