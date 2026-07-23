import { redirect } from "next/navigation";

// The Lighthouse world moved to the app's front door: `/` is now the world,
// entered through the mandatory cold-open gate. This route is kept as a redirect
// so the old /hearth links, the ribbon, and PWA history still land home.
export default function HearthPage() {
  redirect("/");
}
