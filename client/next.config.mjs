/** @type {import('next').NextConfig} */
const serverBase = process.env.NEXT_PUBLIC_SERVER_BASE_URL
  ? process.env.NEXT_PUBLIC_SERVER_BASE_URL.replace(/\/$/, '')
  : 'http://localhost:4000'

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${serverBase}/api/:path*`
      }
    ]
  }
}

export default nextConfig
