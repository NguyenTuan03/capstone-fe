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
  const url = (opts.path ?? '/').replace(/\/+$/, '') || '/';
  const image = opts.image ?? defaultSEO.ogImage;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: defaultSEO.title, template: '%s | Metadata Web App' },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
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
