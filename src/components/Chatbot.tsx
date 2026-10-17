"use client";

import { useEffect, useRef, useState } from "react";
import { profile, about, skills, currentlyDeveloping, projects, certificates, resume, contact } from "@/data/content";

type Ctx = { topic?: "project" | "projects" | "skills" | "certs" | "pitch" | "education" | "contact"; project?: string };
type Reply = { text: string; links?: { label: string; url: string }[]; ctx?: Ctx };
type Msg = { from: "bot" | "you"; text: string; links?: Reply["links"] };

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const compact = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const titles = projects.map((p) => p.title);
const dbNames = ["SQL Server", "PostgreSQL", "SQLite", "MySQL"];
const openText = "Haroon is open to internships, collaborative projects, and opportunities in software development, data analytics, and data science.";
const ownLinks = [{ label: "LinkedIn", url: contact.linkedin }, { label: "GitHub", url: contact.github }];

// Words that identify each project (the project title itself always works too).
const aliases: Record<string, RegExp> = {
  "AT-PAS": /at-?pas|attendance/,
  "Omni Web Scraper": /omni|scrap/,
  "Food Delivery Database System": /food delivery|delivery database|food-delivery|erd/,
  "Human Following Robot": /robot|digital logic|dld/,
};

// ---------- Typo tolerance: nudge unknown words towards words the bot knows ----------
const vocab = new Set(
  [
    ..."projects project skills skill certification certifications certificate certificates education university internship internships experience contact resume github linkedin strengths graduate graduation semester database technology portfolio weakness weaknesses python machine learning hire hiring email available opportunities location based study studying degree tools stack languages built worked intern remote freelance".split(" "),
    ...[...skills.flatMap((g) => g.items), ...projects.flatMap((p) => [p.title, ...p.tech])].flatMap((t) => t.toLowerCase().split(/[^a-z0-9#+]+/)),
    "omniwebscraper", "webscraper", "scraper", "attendance", "delivery", "robot",
  ].filter((w) => w.length >= 4)
);
function dist(a: string, b: string) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)] as number[]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[m][n];
}
function fix(q: string) {
  return q.replace(/[a-z]{5,}/g, (w) => {
    if (vocab.has(w)) return w;
    const lim = w.length >= 8 ? 2 : 1;
    let best = w, bd = lim + 1;
    for (const v of vocab) {
      if (Math.abs(v.length - w.length) > lim) continue;
      const d = dist(w, v);
      if (d < bd) { bd = d; best = v; }
    }
    return best;
  });
}

const projectCard = (p: (typeof projects)[number]): Reply => ({
  text: `${p.title}: ${p.description}\nBuilt with: ${p.tech.join(", ")}.${p.team ? ` ${p.team}.` : ""}`,
  links: p.github ? [{ label: `${p.title} on GitHub`, url: p.github }] : undefined,
  ctx: { topic: "project", project: p.title },
});

/** Answers one specific question about one project (technology, link, team, and so on). */
function projectAnswer(p: (typeof projects)[number], q: string): Reply {
  const ctx: Ctx = { topic: "project", project: p.title };
  if (/\b(github|link|repo\w*|source|code|demo)\b/.test(q))
    return p.github
      ? { text: `Here is the GitHub repository for ${p.title}.`, links: [{ label: `${p.title} on GitHub`, url: p.github }], ctx }
      : { text: `There is no GitHub link listed for ${p.title} yet.`, ctx };
  if (/\b(team|solo|alone|group|members?|individual|who (built|made|worked))\b/.test(q))
    return { text: p.team ? `${p.title} was a ${p.team.charAt(0).toLowerCase() + p.team.slice(1)}.` : `${p.title} is not listed as a team project on his portfolio.`, ctx };
  if (/\b(demonstrat\w*|shows?|learn\w*|skills?)\b/.test(q)) return { text: `${p.title} demonstrates: ${p.demonstrates}.`, ctx };
  if (/\b(features?|key areas?|includes?|covers?|functionalit\w*|modules?)\b/.test(q)) return { text: `${p.title} key areas: ${p.keyAreas.join(", ")}.`, ctx };
  if (/\b(sql|database|db|storage|stores?|stored)\b/.test(q)) {
    const dbs = p.tech.filter((t) => dbNames.includes(t));
    if (dbs.length) return { text: `${p.title} uses ${dbs.join(" and ")} for its data. It is built with ${p.tech.filter((t) => !dbs.includes(t)).join(", ")}.`, ctx };
    return { text: p.tech.includes("SQL") ? `${p.title} is built with ${p.tech.join(", ")}.` : `No database is listed for ${p.title}. It is built with ${p.tech.join(", ")}.`, ctx };
  }
  if (/\b(tech\w*|stack|built with|tools?|framework\w*|languages?|use[sd]?|using|made with)\b/.test(q))
    return { text: `${p.title} is built with ${p.tech.join(", ")}.`, ctx };
  return projectCard(p);
}

const attrWords = /\b(github|link|repo\w*|team|solo|demonstrat\w*|features?|key areas?|sql|database|db|tech\w*|stack|built|languages?|used?|using|tools?)\b/;

/** Finds an answer using only the portfolio content. Returns null when it does not know. */
function answer(raw: string, ctx: Ctx): Reply | null {
  const q0 = raw.toLowerCase().trim();
  if (!q0) return null;
  const q = fix(q0);
  const cq = compact(q);

  // "tell me more" continues the last topic
  if (/^(tell me more|more( details| info)?|elaborate|go on|continue|what else|anything else|details)\b/.test(q)) {
    if (ctx.topic === "project" && ctx.project) {
      const p = projects.find((x) => x.title === ctx.project)!;
      return { text: `More about ${p.title}:\nKey areas: ${p.keyAreas.join(", ")}.\nDemonstrates: ${p.demonstrates}.${p.github ? "" : "\nThere is no GitHub link listed yet."}`, links: p.github ? [{ label: `${p.title} on GitHub`, url: p.github }] : undefined, ctx };
    }
    if (ctx.topic === "projects") return { text: `Which one would you like to hear about? ${titles.join(", ")}.`, ctx };
    if (ctx.topic === "skills") return { text: `He is also developing skills in ${currentlyDeveloping.join(", ")}.`, ctx };
    if (ctx.topic === "certs") return { text: "Every certification has a credential link so you can verify it:", links: certificates.map((c) => ({ label: c.name, url: c.url })), ctx };
    if (ctx.topic === "pitch" || ctx.topic === "contact") return { text: `The best next step is to email Haroon at ${contact.email}.`, links: ownLinks, ctx };
    return { text: "What would you like to know more about? You can ask about his projects, skills, certifications, or contact details." };
  }

  // Which project is the question about? (by name, ordinal, or the one we were just discussing)
  let named = projects.filter((p) => cq.includes(compact(p.title)) || aliases[p.title]?.test(q));
  if (!named.length && (ctx.topic === "projects" || ctx.topic === "project")) {
    const ord: [RegExp, number][] = [[/\b(first|1st)\b/, 0], [/\b(second|2nd)\b/, 1], [/\b(third|3rd)\b/, 2], [/\b(fourth|4th|last)\b/, 3]];
    const hit = ord.find(([re]) => re.test(q));
    if (hit && projects[hit[1]]) named = [projects[hit[1]]];
    else if (ctx.topic === "project" && ctx.project && attrWords.test(q)) named = projects.filter((p) => p.title === ctx.project);
  }

  const techs = [...new Set([...skills.flatMap((g) => g.items), ...projects.flatMap((p) => p.tech)])].filter((t) =>
    new RegExp(`(^|[^a-z0-9#+.])${esc(t.toLowerCase())}($|[^a-z0-9#+.])`).test(q)
  );
  const multi = /\band\b|&|,|\balso\b|\bplus\b/.test(q);
  const noNamed = named.length === 0;

  const H: [boolean, () => Reply][] = [
    // things that are not about Haroon
    [/\b(joke|weather|news|movie|song|recipe|cricket|football|politics|bitcoin|stocks?|translate|homework|poem|story|essay)\b|write (me )?(a|an|some)\b|\bcode (for|to)\b|capital of/.test(q),
      () => ({ text: "I can only answer questions about Haroon and his portfolio, so I can't help with that. Try asking about his projects, skills, or certifications." })],
    [/who are you|what are you|what can you do|what do you do|how can you help|can you help|are you (a |an )?(bot|ai|human|real|chatgpt)|your name/.test(q),
      () => ({ text: `I'm a small assistant on ${profile.name}'s portfolio. I'm not a person, and I only answer from what's on this site: his projects, skills, certifications, education, and contact details. If I don't know something, I can send your question to him.` })],
    [/^(hi|hello|hey|salam|assalam)\b/.test(q) && q.split(/\s+/).length <= 3, () => ({ text: "Hello! Ask me about Haroon's projects, skills, certifications, education, or how to contact him." })],
    [/\b(thanks|thank you|bye|goodbye)\b/.test(q), () => ({ text: "You're welcome! Feel free to ask anything else about Haroon." })],

    // about a specific project
    [named.length > 0, () => (named.length === 1 ? projectAnswer(named[0], q) : { text: named.slice(0, 2).map((p) => projectCard(p).text).join("\n\n"), ctx: { topic: "projects" } })],

    // why hire / strengths
    [/\b(why|should)\b.*\bhire\b|\bstrengths?\b|\bwhat makes (him|haroon)\b|\bstands? out\b|\bgood fit\b|\bworth hiring\b|\bwhy (him|haroon)\b|\bwhat (does|can|would) (he|haroon) (offer|bring)\b|\bbest candidate\b|\bconvince\b|\bsell (him|haroon)\b/.test(q),
      () => {
        const key = ["Python", "C#", "SQL", "Power BI"].filter((t) => [...skills.flatMap((g) => g.items)].includes(t));
        const range = projects.map((p) => p.demonstrates.split(",")[0].toLowerCase()).join(", ");
        return {
          text: `Here is why Haroon is worth a conversation:\n• He learns by building: ${projects.length} real projects covering ${range}.\n• He is certified: ${certificates.map((c) => c.name).join(", ")}.\n• Practical toolkit: ${key.join(", ")}.\n• He keeps growing: currently developing ${currentlyDeveloping.join(", ")}.\n• He is a student looking for internships and collaborative projects.\nSee his projects, or email him at ${contact.email}.`,
          links: [{ label: "See his projects", url: "#projects" }, ...ownLinks], ctx: { topic: "pitch" },
        };
      }],
    [/\bweakness\w*|\bweak\b/.test(q),
      () => ({ text: `I can't judge that for him, but his portfolio is open about where he is: he is a student, and ${currentlyDeveloping.join(", ")} are what he is currently developing. For a deeper conversation, email him at ${contact.email}.`, links: ownLinks })],

    // facts that are not on the portfolio, answered honestly
    [/\b(gpa|cgpa|grades?|marks|percentage)\b/.test(q), () => ({ text: `Haroon does not publish grades or GPA on his portfolio. You can ask him directly at ${contact.email}.`, links: ownLinks })],
    [/graduat\w*|\bsemester\b|\bsem\b|which year|what year/.test(q),
      () => ({ text: `He is currently pursuing a ${about.education.degree} at ${about.education.school}. His portfolio page does not list a semester; his resume shows the expected graduation date.`, links: [{ label: "Download resume", url: resume.file }], ctx: { topic: "education" } })],
    [/work experience|job experience|professional experience|has he (ever )?(worked|done|had|completed)\b.*\b(intern\w*|job|work)|previous (job|work)|employment|how many years/.test(q),
      () => ({ text: `No professional work experience is listed on his portfolio. What it shows is hands-on project work (${titles.join(", ")}), and he is looking for internships.`, links: [{ label: "See his projects", url: "#projects" }] })],
    [/\bhis name\b|\bfull name\b|what'?s his name|what is (he|haroon) called/.test(q), () => ({ text: `His name is ${profile.name}.` })],

    // availability and contact
    [/open to|\bavailab\w*|internship|opportunit\w*|freelance|remote|relocat\w*|full[- ]?time|part[- ]?time|looking for/.test(q),
      () => ({ text: `${openText} For details such as remote work, relocation, or freelance, please email ${contact.email}.`, links: ownLinks, ctx: { topic: "contact" } })],
    [/\b(contact|email|e-mail|reach|linkedin|github|phone|number|call|whatsapp|hire|hiring|collaborat\w*|message|get in touch)\b/.test(q),
      () => ({ text: `You can email Haroon at ${contact.email}, or find him on LinkedIn and GitHub. ${/\b(phone|number|call|whatsapp)\b/.test(q) ? "He does not list a phone number publicly, so email is the best way. " : ""}He is open to internships, collaborative projects, and opportunities in software development, data analytics, and data science.`, links: ownLinks, ctx: { topic: "contact" } })],
    [/\b(resume|cv|curriculum)\b/.test(q), () => ({ text: "You can download Haroon's resume as a PDF.", links: [{ label: "Download resume", url: resume.file }] })],

    // certifications, education, and so on
    [/\b(certificat\w*|certified|courses?|credentials?|badge)\b/.test(q),
      () => {
        const hits = certificates.filter((c) => compact(c.name).includes(compact(q.replace(/.*\b(in|for|of|has|have|an?|the)\b /, "")).slice(0, 6)) || techs.some((t) => c.name.toLowerCase().includes(t.toLowerCase())));
        const list = hits.length && techs.length ? hits : certificates;
        return { text: (hits.length && techs.length ? "Yes: " : /how many/.test(q) ? `Haroon has ${certificates.length} certifications:\n` : "Haroon's certifications:\n") + list.map((c) => `• ${c.name} (${c.issuer}, ${c.date})`).join("\n"), ctx: { topic: "certs" } };
      }],
    [/\b(education|study|studying|university|degree|uet|college|student|school|qualification)\b/.test(q),
      () => ({ text: `${/\bis (he|haroon) (a )?student\b/.test(q) ? "Yes. " : ""}${about.education.degree} at ${about.education.school} (${about.education.status.toLowerCase()}).`, ctx: { topic: "education" } })],
    [/\b(learn\w*|currently|machine learning|ml|ai|artificial|goals?|future|next)\b/.test(q),
      () => ({ text: `Haroon is currently developing skills in ${currentlyDeveloping.join(", ")}. His approach: ${about.approach.join(" → ")}.`, ctx: { topic: "skills" } })],
    [/\b(interests?|passion\w*|hobb\w*)\b/.test(q), () => ({ text: `His portfolio lists these professional interests: ${about.interests.join(", ")}.` })],
    [/\b(where|location|live|based|city|country|lahore|pakistan)\b/.test(q), () => ({ text: `Haroon is based in ${profile.location}.` })],
    [/\b(who (is|s) (he|haroon)|about (him|haroon|himself)|introduce|background|tell me about (him|haroon))\b/.test(q), () => ({ text: profile.intro })],

    // projects in general, technologies, skills
    [noNamed && /\b(best|favou?rite|most (impressive|proud)|top)\b.*\bproject|\bproject.*\b(best|favou?rite)\b/.test(q),
      () => ({ text: "I can't rank them, because each one shows different skills:\n" + projects.map((p) => `• ${p.title}: ${p.demonstrates}`).join("\n"), ctx: { topic: "projects" } })],
    [noNamed && (/\bprojects?\b|\bbuilt\b|\bwork(ed)? on\b|\bportfolio\b/.test(q) || techs.length > 0 && /\bproject/.test(q)),
      () => {
        const list = techs.length ? projects.filter((p) => p.tech.some((t) => techs.includes(t))) : projects;
        const count = /how many/.test(q) ? `Haroon's portfolio shows ${projects.length} projects:\n` : techs.length ? `Projects using ${techs.join(", ")}:\n` : "Haroon's projects:\n";
        return { text: count + list.map((p) => `• ${p.title}: ${p.subtitle}`).join("\n") + "\nAsk about any of them for details.", ctx: { topic: "projects" } };
      }],
    [noNamed && techs.length > 0, () => {
      const used = projects.filter((p) => p.tech.some((t) => techs.includes(t)));
      const groups = skills.filter((g) => g.items.some((i) => techs.includes(i))).map((g) => g.group);
      return { text: `Yes, ${techs.join(", ")} ${techs.length > 1 ? "are" : "is"} part of Haroon's toolkit${groups.length ? ` (${groups.join(", ")})` : ""}.${used.length ? ` Used in: ${used.map((p) => p.title).join(", ")}.` : ""}`, ctx: { topic: "skills" } };
    }],
    [techs.length === 0 && /\b(skills?|tech|stack|tools?|languages?|technologies|know|good at|expertise|proficien\w*)\b/.test(q),
      () => ({ text: (/\b(know|use|familiar|experience|work with)\b/.test(q) ? "I can only speak to what is listed in his portfolio. Haroon's skills:\n" : "Haroon's skills:\n") + skills.map((g) => `• ${g.group}: ${g.items.join(", ")}`).join("\n"), ctx: { topic: "skills" } })],
  ];

  const hits = H.filter(([t]) => t).map(([, run]) => run());
  if (!hits.length) return null;
  if (!multi || hits.length === 1) return hits[0];
  const top = hits.slice(0, 3);
  return { text: top.map((h) => h.text).join("\n\n"), links: top.flatMap((h) => h.links ?? []), ctx: top[0].ctx };
}

const suggestions = ["What projects has Haroon built?", "What are his skills?", "Is he open to internships?", "What certifications does he have?"];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Hi! I'm a small assistant that answers questions about Haroon using his portfolio. What would you like to know?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [pending, setPending] = useState<string | null>(null); // question waiting to be forwarded
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const ctx = useRef<Ctx>({}); // remembers the last topic, so "tell me more" works
  const field = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null); // null = default size
  const big = !!size && size.w >= 520;

  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [msgs, typing, pending]);
  useEffect(() => { if (open) field.current?.focus(); }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const botSay = (m: Msg) => setMsgs((x) => [...x, m]);

  function ask(text: string) {
    const q = text.trim();
    if (!q || typing) return;
    setMsgs((x) => [...x, { from: "you", text: q }]);
    setInput(""); setPending(null); setTyping(true);
    setTimeout(() => {
      const r = answer(q, ctx.current);
      setTyping(false);
      if (r) {
        const { ctx: next, ...reply } = r;
        if (next) ctx.current = next;
        botSay({ from: "bot", ...reply });
      }
      else {
        botSay({ from: "bot", text: "I don't have that information. Would you like me to send your question to Haroon so he can answer you by email?" });
        setPending(q);
      }
    }, 400);
  }

  async function forward(e: React.FormEvent) {
    e.preventDefault();
    if (!pending) return;
    const question = pending;
    if (contact.formKey.startsWith("[")) {
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent("Question from your portfolio")}&body=${encodeURIComponent(`${question}\n\nReply to: ${email}`)}`;
      botSay({ from: "bot", text: "Opening your email app so you can send the question." });
      setPending(null); return;
    }
    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: contact.formKey, from_name: "Portfolio chatbot", name: "Chatbot visitor", email, subject: "Question from your portfolio chatbot", message: question }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error();
      botSay({ from: "bot", text: "Thank you! Your question was sent to Haroon. He will reply to your email." });
      setEmail("");
    } catch {
      botSay({ from: "bot", text: `Sorry, that did not send. Please email Haroon directly at ${contact.email}.` });
    }
    setSending(false); setPending(null);
  }

  // Drag the top-left corner to resize (the panel is anchored bottom-right, so it grows up and left)
  function startDrag(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    const r = panel.current!.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY, sw = r.width, sh = r.height;
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) =>
      setSize({
        w: Math.min(window.innerWidth - 40, Math.max(300, sw + (sx - ev.clientX))),
        h: Math.min(window.innerHeight - 112, Math.max(360, sh + (sy - ev.clientY))),
      });
    const up = () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  }
  const toggleBig = () =>
    setSize(big ? null : { w: Math.min(560, window.innerWidth - 40), h: Math.min(640, window.innerHeight - 112) });

  return (
    <>
      {open && (
        <div ref={panel} style={size ? { width: size.w, height: size.h } : undefined} role="dialog" aria-label="Chat about Haroon" className="fixed right-5 bottom-24 z-50 flex max-w-[calc(100vw-2.5rem)] h-[28rem] max-h-[calc(100dvh-8rem)] w-[min(22rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-2xl">
          <div className="gradient-bg relative flex items-center justify-between py-3 pr-3 pl-8 text-white">
            <div
              onPointerDown={startDrag}
              onDoubleClick={() => setSize(null)}
              title="Drag to resize, double-click to reset"
              aria-hidden
              className="absolute top-0 left-0 z-10 grid h-8 w-8 cursor-nwse-resize touch-none place-items-center opacity-80 hover:opacity-100"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 12L12 2M2 7L7 2" /></svg>
            </div>
            <div><p className="font-bold">Ask about Haroon</p><p className="text-xs opacity-90">Answers come from his portfolio</p></div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={toggleBig} aria-label={big ? "Shrink chat" : "Expand chat"} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/20">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={big ? "M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" : "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"} /></svg>
              </button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-lg px-2 py-1 text-lg hover:bg-white/20">✕</button>
            </div>
          </div>
          <div className={`flex-1 space-y-3 overflow-y-auto p-4 ${big ? "text-base" : "text-sm"}`} aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`max-w-[88%] rounded-2xl px-3 py-2 leading-relaxed whitespace-pre-line ${m.from === "you" ? "gradient-bg ml-auto rounded-br-md text-white" : "rounded-bl-md bg-chip text-ink"}`}>
                {m.text}
                {m.links && <span className="mt-2 flex flex-wrap gap-3">{m.links.map((l) => <a key={l.url} href={l.url} target={l.url.startsWith("#") ? undefined : "_blank"} rel="noopener noreferrer" className="font-bold text-accent underline">{l.label}</a>)}</span>}
              </div>
            ))}
            {typing && <div className="w-fit rounded-2xl rounded-bl-md bg-chip px-3 py-2 text-muted">Typing...</div>}
            {pending && !typing && (
              <form onSubmit={forward} className="space-y-2 rounded-xl border border-line p-3">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email, so he can reply" aria-label="Your email" className="w-full rounded-lg border border-line bg-paper px-3 py-2 outline-none focus:border-brand-purple" />
                <div className="flex gap-2">
                  <button type="submit" disabled={sending} className="gradient-bg rounded-lg px-3 py-2 font-bold text-white disabled:opacity-60">{sending ? "Sending..." : "Send to Haroon"}</button>
                  <button type="button" onClick={() => setPending(null)} className="rounded-lg border border-line px-3 py-2 font-bold">No thanks</button>
                </div>
              </form>
            )}
            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((s) => <button key={s} type="button" onClick={() => ask(s)} className="rounded-full border border-line px-3 py-1 text-left text-xs font-semibold transition hover:border-brand-purple">{s}</button>)}
              </div>
            )}
            <div ref={end} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex gap-2 border-t border-line p-3">
            <input ref={field} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question..." aria-label="Your question" maxLength={200} className="min-w-0 flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-brand-purple" />
            <button type="submit" className="gradient-bg rounded-lg px-4 py-2 text-sm font-bold text-white">Send</button>
          </form>
        </div>
      )}
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? "Close chat" : "Open chat about Haroon"} className="gradient-bg fixed right-5 bottom-5 z-50 grid h-14 w-14 place-items-center rounded-full text-2xl text-white shadow-xl transition hover:-translate-y-1">
        <span aria-hidden>{open ? "✕" : "💬"}</span>
      </button>
    </>
  );
}
