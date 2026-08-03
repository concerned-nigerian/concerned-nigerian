/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-6f548d150fd546efb69d5e1a1c243bff.r2.dev',
      },
    ],
  },
}

export default nextConfig
