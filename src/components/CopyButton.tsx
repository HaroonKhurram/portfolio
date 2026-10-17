"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {}
  }
  return (
    <>
      <button type="button" onClick={copy} aria-label="Copy email address" className="rounded-lg border border-line px-3 py-1 text-xs font-bold transition hover:border-brand-purple">
        {done ? "Copied ✓" : "Copy"}
      </button>
      <span className="sr-only" role="status">{done ? "Email address copied" : ""}</span>
    </>
  );
}
