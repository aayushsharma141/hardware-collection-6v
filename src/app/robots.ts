import { MetadataRoute } from 'next';

/** Never crawled: the embedded CMS and the API routes. */
const PRIVATE_PATHS = ['/studio/', '/api/'];

/**
 * A crawler obeys only the most specific group naming it, so a named group
 * does not inherit the `*` disallows. Each one has to repeat them, or Googlebot
 * (for one) is free to crawl /studio and /api.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: ['*', 'Googlebot', 'Bingbot', 'OAI-SearchBot'].map((userAgent) => ({
      userAgent,
      allow: '/',
      disallow: PRIVATE_PATHS,
    })),
    sitemap: 'https://www.hardwarecollection.co/sitemap.xml',
  };
}
