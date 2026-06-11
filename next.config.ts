import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Supabase Storage public bucket — listing photos uploaded via create-product.
        protocol: 'https',
        hostname: 'yeaxtwjjsefojfdqrcvl.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
