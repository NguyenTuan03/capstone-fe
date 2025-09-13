import type { Metadata } from 'next';
import { SITE_URL, defaultSEO } from '../utils/siteMetadata';

type SEOOpts = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
};

export function buildMetadata(opts: SEOOpts = {}): Metadata {
  const title = opts.title ?? defaultSEO.title;
  const description = opts.description ?? defaultSEO.description;
  const path = (opts.path ?? '/').replace(/\/+$/, '') || '/';
  const fullUrl = `${SITE_URL}${path}`;
  const image = opts.image ?? defaultSEO.ogImage;

  return {
    metadataBase: new URL(SITE_URL),
    title: opts.title ? `${opts.title} | ${defaultSEO.title}` : defaultSEO.title,
    description,
    alternates: { canonical: fullUrl },
    openGraph: {
      type: 'website',
      url: fullUrl,
      title,
      description,
      siteName: defaultSEO.title,
      images: [{ url: image, width: 1200, height: 630 }],
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: defaultSEO.twitter,
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    icons: { icon: '/favicon.ico' },
    applicationName: defaultSEO.title,
  };
}
