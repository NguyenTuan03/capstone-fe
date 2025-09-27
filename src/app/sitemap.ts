import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/@crema/utils/siteMetadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/signin',
    '/dashboard',
    '/users',
    '/coaches',
    '/sessions',
    '/content',
    '/analytics',
    '/settings',
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}
