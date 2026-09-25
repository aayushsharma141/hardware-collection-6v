import { createClient, type SanityClient } from "next-sanity";

import { apiVersion, getDataset, getProjectId, useCdn } from "./env";

/**
 * Constructed on first property access rather than at module load.
 *
 * `getProjectId()` and `getDataset()` are deferred (see `./env`), so calling
 * them here at module scope would defeat that and put the lookup back into
 * Next.js' page-data collection pass. The proxy keeps every existing call site
 * — `client.fetch(...)` — working unchanged while the real client is built the
 * first time something actually reaches for it.
 */

let instance: SanityClient | undefined;

export function getClient(): SanityClient {
  if (!instance) {
    instance = createClient({
      projectId: getProjectId(),
      dataset: getDataset(),
      apiVersion,
      useCdn,
      token: process.env.SANITY_API_TOKEN,
      // The token authenticates as an editor, so without this the API would use
      // its default `raw` perspective and return unpublished drafts alongside
      // published documents. Sanity's Publish button is the only gate on what the
      // public site renders.
      perspective: "published",
    });
  }

  return instance;
}

export const client: SanityClient = new Proxy({} as SanityClient, {
  get(_target, property) {
    const resolved = getClient() as unknown as Record<string | symbol, unknown>;
    const value = resolved[property];

    // Methods must stay bound to the real client — `fetch` and friends read
    // their own internals off `this`.
    return typeof value === "function" ? value.bind(resolved) : value;
  },
});
