"use client";

import { useState } from "react";
import { contact } from "@/data/content";

const field =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error" | "mail">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>;
    // Until a Web3Forms key is added in content.ts, fall back to the visitor's email app.
    if (contact.formKey.startsWith("[")) {
      const body = `${d.message}\n\n${d.name} (${d.email})`;
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(body)}`;
      setStatus("mail");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...d, access_key: contact.formKey, from_name: "Portfolio contact form" }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error();
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line bg-paper p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Name
          <input name="name" required autoComplete="name" className={`${field} mt-1 font-normal`} />
        </label>
        <label className="text-sm font-semibold">
          Email
          <input name="email" type="email" required autoComplete="email" className={`${field} mt-1 font-normal`} />
        </label>
      </div>
      <label className="block text-sm font-semibold">
        Subject
        <input name="subject" required className={`${field} mt-1 font-normal`} />
      </label>
      <label className="block text-sm font-semibold">
        Message
        <textarea name="message" required rows={5} className={`${field} mt-1 font-normal`} />
      </label>
      {/* Spam trap: hidden from people, filled in by bots */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      <button
        type="submit"
        disabled={status === "sending"}
        className="gradient-bg rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
      <p role="status" className="text-sm text-muted">
        {status === "ok" && "Thank you! Your message was sent. I will reply soon."}
        {status === "error" && "Something went wrong. Please email me directly instead."}
        {status === "mail" && "Opening your email app..."}
      </p>
    </form>
  );
}
