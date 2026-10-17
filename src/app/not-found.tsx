import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-6 text-center">
      <div className="hero-bg absolute inset-0" aria-hidden />
      <div className="relative">
        <p className="gradient-text text-8xl font-extrabold">404</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Page not found</h1>
        <p className="mt-3 text-muted">The page you are looking for does not exist or has moved.</p>
        <Link href="/" className="gradient-bg mt-8 inline-flex rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
          Back to the portfolio
        </Link>
      </div>
    </main>
  );
}
