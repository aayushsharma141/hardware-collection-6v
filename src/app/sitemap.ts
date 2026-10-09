import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.hardwarecollection.co';
  // Stable content revision date matching last catalogue & architecture update
  const lastModified = new Date('2026-10-09');

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/catalogues`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}
