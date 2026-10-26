"use client";

/**
 * Last-resort screen for a failure in the root layout itself, which replaces
 * the whole document (so no globals.css, fonts or chrome). Kept plain and
 * self-contained on purpose.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui, sans-serif", background: "#fbf5ea", color: "#1a1017", textAlign: "center", padding: "24px" }}>
        <main>
          <h1 style={{ fontWeight: 400, fontSize: "1.75rem", letterSpacing: "0.04em", margin: "0 0 12px" }}>Hardware Collection</h1>
          <p style={{ margin: "0 0 24px", color: "#3d2e38" }}>The site hit a problem loading. Please try again in a moment.</p>
          <button
            type="button"
            onClick={reset}
            style={{ height: 44, padding: "0 24px", border: 0, background: "#1a1017", color: "#fbf5ea", fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Try again
          </button>
          <p style={{ marginTop: 24, fontSize: 14 }}>
            Or call the showroom: <a href="tel:+919835190738" style={{ color: "inherit" }}>+91 98351 90738</a>
          </p>
        </main>
      </body>
    </html>
  );
}
