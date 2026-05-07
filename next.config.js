/** @type {import('next').NextConfig} */
const isStaticExport = process.env.EXPORT === 'true'

const nextConfig = {
  reactStrictMode: true,
  ...(isStaticExport && {
    output: 'export',
    basePath: '/flow-clock',
    assetPrefix: '/flow-clock/',
    env: {
      NEXT_PUBLIC_BASE_PATH: '/flow-clock',
    },
  }),
}

module.exports = nextConfig
