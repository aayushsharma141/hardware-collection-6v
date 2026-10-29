import { redirect } from "next/navigation";

export const metadata = {
  title: "Brands & Catalogues | Hardware Collection",
  description:
    "Explore authorized architectural hardware brands and view official catalogues within Hardware Collection's showroom collections.",
  alternates: {
    canonical: "https://www.hardwarecollection.co/collections",
  },
};

type LegacyCatalogueSearchParams = Record<string, string | string[] | undefined>;

/**
 * Legacy route compatibility. Brand/PDF deep links are preserved as query
 * parameters so the integrated catalogue experience on /collections can open
 * the same brand and matched PDF page.
 */
export default async function LegacyCataloguesRedirect({
  searchParams,
}: {
  searchParams: Promise<LegacyCatalogueSearchParams>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value.length > 0) query.set(key, value);
    else if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
  }
  const suffix = query.size ? `?${query.toString()}` : "";
  redirect(`/collections${suffix}`);
}
