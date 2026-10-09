import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hardware Collection | Architectural Hardware & Digital Locks",
    short_name: "Hardware Collection",
    description: "Authorized Hafele, Dorset, Yale & Blum dealer in Sakchi, Jamshedpur. Premium architectural hardware, modular kitchen fittings, and biometric digital locks.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf5ea",
    theme_color: "#8b1a42",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
