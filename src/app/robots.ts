import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/collections'],
      disallow: ['/studio/', '/api/'],
    },
    sitemap: 'https://hardwarecollection.co/sitemap.xml',
  };
}
