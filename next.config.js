/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/easy-techradar' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/easy-techradar/' : '',
}

module.exports = nextConfig