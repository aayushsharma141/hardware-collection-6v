import type { MetadataRoute } from "next";

const CANONICAL_HOST = "https://www.hardwarecollection.co";

export default function sitemap(): MetadataRoute.Sitemap {
  // The three public content routes (see CLAUDE.md). Showroom families are
  // in-page anchors on /collections, never routes of their own.
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
    {
      url: `${CANONICAL_HOST}/catalogues`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
