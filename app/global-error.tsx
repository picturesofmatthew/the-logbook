"use client";

// The last-resort boundary: an uncaught error in the root layout itself. It
// replaces the whole document, so it carries its own <html>/<body> and inline
// styling — the app's fonts and stylesheet may not have loaded at this point,
// so we don't rely on Tailwind utilities or CSS tokens here. Still warm: paper
// and ink, not a white crash page. Palette values mirror globals.css.
export default function GlobalError({
  error,
  unstable_retry,
  reset,
}: {
  error: Error & { digest?: string };
  unstable_retry?: () => void;
  reset?: () => void;
}) {
  const retry = unstable_retry ?? reset;
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          background: "#f5eddc",
          color: "#4a3b2a",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <title>signed × sealed — something slipped</title>
        <div style={{ fontSize: "2.5rem", color: "#d9a441" }} aria-hidden>
          ✦
        </div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
          the book closed itself
        </h1>
        <p
          style={{
            maxWidth: "22rem",
            fontSize: "0.95rem",
            color: "#7a6a52",
            margin: 0,
          }}
        >
          Something went wrong opening the grimoire. Give it a moment, then try
          again.
        </p>
        {error.digest ? (
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.05em",
              color: "#7a6a52",
              opacity: 0.6,
              margin: 0,
            }}
          >
            mark {error.digest}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => retry?.()}
          style={{
            marginTop: "0.5rem",
            border: "2px solid #4a3b2a",
            background: "#fbf6ea",
            color: "#4a3b2a",
            padding: "0.5rem 1.25rem",
            fontSize: "0.95rem",
            fontFamily: "inherit",
            borderRadius: "255px 18px 225px 18px / 18px 225px 18px 255px",
            cursor: "pointer",
          }}
        >
          try again
        </button>
      </body>
    </html>
  );
}
