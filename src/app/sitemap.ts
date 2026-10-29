import type { MetadataRoute } from "next";

/** The public information architecture intentionally has two indexable pages. */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.hardwarecollection.co";
  return [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
