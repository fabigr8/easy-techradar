/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/technology-radar' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/technology-radar/' : '',
}

module.exports = nextConfig