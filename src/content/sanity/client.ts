import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, useCdn } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  token: process.env.SANITY_API_TOKEN,
  // The token authenticates as an editor, so without this the API would use
  // its default `raw` perspective and return unpublished drafts alongside
  // published documents. Sanity's Publish button is the only gate on what the
  // public site renders.
  perspective: "published",
});
