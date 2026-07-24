import Link from "next/link";

// A page that isn't in the book — a nudged URL, a stale link, a bad or future
// day slug (book/[day] calls notFound()). Kept in the grimoire's voice rather
// than the bare Next 404. Server component; renders inside the chrome.
export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-8 text-center">
      <p aria-hidden className="font-display text-4xl text-gold">
        ✦
      </p>
      <h1 className="font-display text-2xl text-ink">
        this page isn&apos;t in the book
      </h1>
      <p className="max-w-xs font-sans text-sm text-ink-soft">
        Whatever you were looking for hasn&apos;t been written here — or was torn
        out. The glade is where the book opens.
      </p>
      <Link
        href="/"
        className="wobbly mt-2 border-2 border-ink bg-cream px-5 py-2 font-display text-sm text-ink"
      >
        back to the lighthouse
      </Link>
    </main>
  );
}
