/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Helps Vercel with optimized serverless deployment
  async redirects() {
    return [
      {
        source: '/sign-in',
        destination: '/api/auth/login',
        permanent: true,
      },
      {
        source: '/sign-up',
        destination: '/api/auth/register',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        // Apply CORS headers to all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ]
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  webpack: (config, { webpack }) => {
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    return config
  },
}
module.exports = nextConfig