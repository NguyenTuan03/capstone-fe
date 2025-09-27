import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PICKLE-LEARN Admin Portal',
    short_name: 'PL Admin',
    description: 'Hệ thống quản trị nền tảng học Pickleball',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    orientation: 'portrait',
    categories: ['education', 'sports', 'admin'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
      // Temporary removed non-existing icons for UI development
      // {
      //   src: '/assets/images/icon-192.png',
      //   sizes: '192x192',
      //   type: 'image/png',
      // },
      // {
      //   src: '/assets/images/icon-512.png',
      //   sizes: '512x512',
      //   type: 'image/png',
      //   purpose: 'any maskable',
      // },
    ],
  };
}
