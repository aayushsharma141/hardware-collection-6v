import type { MetadataRoute } from "next";

const CANONICAL_HOST = "https://www.hardwarecollection.co";

export default function sitemap(): MetadataRoute.Sitemap {
  // The public site intentionally has two indexable routes. Catalogue viewers
  // and brand discovery live inside /collections; /catalogues is a legacy URL
  // that redirects to /collections and must not be listed as a canonical page.
  const lastModified = new Date("2026-10-29");

  return [
    {
      url: `${CANONICAL_HOST}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${CANONICAL_HOST}/collections`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
