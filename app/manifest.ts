import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "signxsealed",
    short_name: "signxsealed",
    description: "A shared logbook for Matthew & Kennedy",
    start_url: "/",
    display: "standalone",
    background_color: "#f5eddc",
    theme_color: "#f5eddc",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
