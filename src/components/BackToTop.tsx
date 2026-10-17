"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`gradient-bg fixed right-5 bottom-24 z-40 grid h-12 w-12 place-items-center rounded-full text-xl font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 ${show ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
    >
      ↑
    </button>
  );
}
