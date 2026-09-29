import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/content/sanity/client";

const token = process.env.SANITY_API_TOKEN;

// Without a token the handler cannot validate the Studio's preview secret, so
// draft mode stays unavailable rather than being enabled unauthenticated.
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token }),
});
