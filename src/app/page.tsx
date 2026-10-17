import Image from "next/image";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import CopyButton from "@/components/CopyButton";
import BackToTop from "@/components/BackToTop";
import Chatbot from "@/components/Chatbot";
import ScrollProgress from "@/components/ScrollProgress";
import { siteUrl } from "@/lib/site";
import { profile, highlights, about, skills, currentlyDeveloping, projects, certificates, resume, contact, site } from "@/data/content";

const btn = "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold transition hover:-translate-y-0.5";
const btnPrimary = `${btn} gradient-bg text-white shadow-md hover:shadow-lg`;
const btnOutline = `${btn} border border-line bg-paper text-ink hover:border-brand-purple`;
const card = "card-accent relative h-full overflow-hidden rounded-2xl border border-line bg-paper transition duration-300 hover:-translate-y-1 hover:shadow-xl";
const tag = "rounded-full bg-chip px-3 py-1 text-xs font-semibold text-ink";
const icon = "gradient-bg mb-4 grid h-11 w-11 place-items-center rounded-xl text-xl shadow-md";
const hlIcons = ["📊", "💻", "🛠️"];
const skillIcons = ["🐍", "📈", "🗄️", "🌐", "🧰"];
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Data Science Student",
  description: profile.metaDescription,
  url: siteUrl,
  image: `${siteUrl}/haroon.webp`,
  sameAs: [contact.github, contact.linkedin],
  affiliation: { "@type": "CollegeOrUniversity", name: "University of Engineering and Technology, Lahore" },
  knowsAbout: ["Data Science", "Python", "SQL", "Power BI", "Machine Learning"],
};
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const stagger = (i: number) => Math.min(i, 5) * 90;

function Section({ id, title, eyebrow, variant = "plain", children }: { id: string; title: string; eyebrow: string; variant?: "plain" | "tint" | "dots" | "glow"; children: React.ReactNode }) {
  return (
    <section id={id} className={`relative overflow-hidden py-24 ${variant === "tint" || variant === "glow" ? "bg-surface" : ""}`}>
      {variant === "dots" && <div className="dot-grid absolute inset-0" aria-hidden />}
      {variant === "glow" && <div className="glow-bg absolute inset-0" aria-hidden />}
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-accent">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h2>
          <span className="gradient-bg mt-4 mb-10 block h-1 w-16 rounded-full" />
        </Reveal>
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-paper focus:px-4 focus:py-2 focus:font-bold focus:shadow-lg">Skip to content</a>
      <Navbar />
      <main id="main">
        <section id="home" className="relative overflow-hidden">
          <div className="hero-bg absolute inset-0" aria-hidden />
          <div className="dot-grid absolute inset-0 opacity-60" aria-hidden />
          <div className="relative mx-auto grid min-h-[84vh] max-w-6xl items-center gap-12 px-6 pt-16 pb-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <Reveal>
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted">{profile.title}</p>
                <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl">
                  Hi, I&apos;m <span className="gradient-text">{profile.name}</span>
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{profile.intro}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="#projects" className={btnPrimary}>View My Projects</a>
                  <a href={resume.file} download className={btnOutline}>Download Resume</a>
                  <a href="#contact" className={btnOutline}>Contact Me</a>
                </div>
              </Reveal>
            </div>
            <Reveal delay={200}>
              <div className="float relative mx-auto w-64 sm:w-72 lg:w-full lg:max-w-sm">
                <div className="gradient-bg absolute inset-0 rounded-full opacity-40 blur-3xl" aria-hidden />
                <div className="gradient-bg relative rounded-full p-1.5 shadow-2xl">
                  <div className="rounded-full bg-paper p-1.5">
                    <Image src="/haroon.webp" alt="Portrait of Haroon Khurram" width={720} height={720} priority sizes="(min-width: 1024px) 384px, 288px" className="aspect-square w-full rounded-full object-cover" />
                  </div>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-paper px-4 py-2 text-xs font-bold shadow-lg">
                  BS Data Science · UET Lahore
                </div>
              </div>
            </Reveal>
          </div>
          <div className="relative mx-auto grid max-w-6xl gap-4 px-6 pb-20 md:grid-cols-3">
            {highlights.map((h, i) => (
              <Reveal key={h.title} delay={stagger(i)} className="h-full">
                <div className={`${card} always p-6`}>
                  <div className={icon} aria-hidden>{hlIcons[i]}</div>
                  <h2 className="font-bold">{h.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{h.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Section id="about" eyebrow="About" title="Background and direction" variant="tint">
          <div className="grid gap-10 lg:grid-cols-5">
            <Reveal className="lg:col-span-3">
              <div className="space-y-4 leading-relaxed text-muted">{about.bio.map((p) => <p key={p}>{p}</p>)}</div>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-2">
              <div className={`${card} always p-6`}>
                <p className="text-xs font-bold uppercase tracking-widest text-muted">Education</p>
                <h3 className="mt-2 text-lg font-bold">{about.education.degree}</h3>
                <p className="text-muted">{about.education.school}</p>
                <p className="mt-2 text-sm font-semibold text-accent">{about.education.status}</p>
              </div>
            </Reveal>
          </div>
          <Reveal>
            <div className="mt-10 flex flex-wrap gap-2">{about.interests.map((i) => <span key={i} className={tag}>{i}</span>)}</div>
            <ol className="mt-10 flex flex-wrap items-center gap-3 text-lg font-extrabold">
              {about.approach.map((a, i) => (
                <li key={a} className="flex items-center gap-3">
                  <span className="gradient-text">{a}</span>
                  {i < about.approach.length - 1 && <span className="text-muted" aria-hidden>→</span>}
                </li>
              ))}
            </ol>
          </Reveal>
        </Section>

        <Section id="skills" eyebrow="Skills" title="Technical skills" variant="dots">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((g, i) => (
              <Reveal key={g.group} delay={stagger(i)} className="h-full">
                <div className={`${card} always p-6`}>
                  <div className={icon} aria-hidden>{skillIcons[i]}</div>
                  <h3 className="font-bold">{g.group}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">{g.items.map((s) => <span key={s} className={tag}>{s}</span>)}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-6">
            <div className="gradient-bg rounded-2xl p-px">
              <div className="rounded-[15px] bg-paper p-6">
                <h3 className="font-bold">Currently developing</h3>
                <p className="gradient-text mt-2 font-semibold">{currentlyDeveloping.join("  •  ")}</p>
              </div>
            </div>
          </Reveal>
        </Section>

        <Section id="projects" eyebrow="Projects" title="Selected work" variant="glow">
          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={stagger(i % 2)} className="h-full">
                <article className={`${card} group flex flex-col`}>
                  {p.images.length > 0 && (
                    <div className={`grid gap-2 p-2 ${p.images.length > 1 ? "grid-cols-2" : ""}`}>
                      {p.images.map((img) => (
                        <div key={img.src} className="relative aspect-[16/10] overflow-hidden rounded-xl bg-chip">
                          <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 280px, 50vw" className="object-cover object-top transition duration-500 group-hover:scale-105" />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-extrabold">{p.title}</h3>
                    <p className="text-sm font-semibold text-accent">{p.subtitle}</p>
                    {p.team && <p className="mt-2 w-fit rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted">{p.team}</p>}
                    <p className="mt-3 text-sm leading-relaxed text-muted">{p.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">{p.tech.map((t) => <span key={t} className={tag}>{t}</span>)}</div>
                    <p className="mt-4 text-sm text-muted"><span className="font-bold text-ink">Key areas: </span>{p.keyAreas.join(" · ")}</p>
                    <p className="mt-2 text-sm text-muted"><span className="font-bold text-ink">Demonstrates: </span>{p.demonstrates}</p>
                    {p.github && <a href={p.github} {...ext} className={`${btnOutline} mt-6 w-fit`}>View on GitHub</a>}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="certifications" eyebrow="Certifications & Resume" title="Credentials">
          <div className="grid gap-5 sm:grid-cols-2">
            {certificates.map((c, i) => (
              <Reveal key={c.name} delay={stagger(i % 2)} className="h-full">
                <div className={`${card} p-6`}>
                  <h3 className="font-bold">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted">{c.issuer}</p>
                  <p className="text-sm text-muted">{c.date}</p>
                  <a href={c.url} {...ext} className="mt-4 inline-block text-sm font-bold text-accent hover:underline">View credential →</a>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-surface p-6 md:flex-row md:items-center">
              <p className="max-w-xl text-muted">{resume.text}</p>
              <a href={resume.file} download className={btnPrimary}>Download Resume</a>
            </div>
          </Reveal>
        </Section>

        <Section id="contact" eyebrow="Contact" title={contact.heading} variant="tint">
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <p className="leading-relaxed text-muted">{contact.text}</p>
              <dl className="mt-8 space-y-4 text-sm">
                <div><dt className="font-bold">Email</dt><dd className="flex flex-wrap items-center gap-3"><a className="text-accent hover:underline" href={`mailto:${contact.email}`}>{contact.email}</a><CopyButton text={contact.email} /></dd></div>
                <div><dt className="font-bold">GitHub</dt><dd><a className="text-accent hover:underline" href={contact.github} {...ext}>{contact.github.replace("https://", "")}</a></dd></div>
                <div><dt className="font-bold">LinkedIn</dt><dd><a className="text-accent hover:underline" href={contact.linkedin} {...ext}>Haroon Khurram on LinkedIn</a></dd></div>
                <div><dt className="font-bold">Location</dt><dd className="text-muted">{profile.location}</dd></div>
              </dl>
            </Reveal>
            <Reveal delay={120}><ContactForm /></Reveal>
          </div>
        </Section>
      </main>
      <BackToTop />
      <Chatbot />
      <footer className="border-t border-line py-8 text-center text-sm text-muted">© 2026 {profile.name} · Last updated {site.lastUpdated}</footer>
    </>
  );
}
