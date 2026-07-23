import { redirect } from "next/navigation";

// The old museum became the Apothecary, folded into the Field Book (/library).
// Kept as a redirect so old bookmarks, PWA history, and shared links still land
// on the shelf.
export default function MuseumPage() {
  redirect("/library#apothecary");
}
