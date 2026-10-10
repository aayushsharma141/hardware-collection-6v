import React from "react";

/** Shown only while Next.js Draft Mode is on, so editors never mistake a preview for the live site. */
export default function DraftModeBanner() {
  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-3 rounded-full bg-[#1a1017] px-4 py-2 text-xs text-white shadow-lg"
    >
      <span>Draft preview: unpublished changes are visible</span>
      <a href="/api/draft-mode/disable" className="font-semibold underline underline-offset-2 hc-focus">
        Exit
      </a>
    </div>
  );
}
