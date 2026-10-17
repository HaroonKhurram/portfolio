import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { profile } from "@/data/content";
import { siteUrl } from "@/lib/site";

const title = `${profile.name} | Data Science Portfolio`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s | ${profile.name}` },
  description: profile.metaDescription,
  alternates: { canonical: "/" },
  openGraph: { title, description: profile.metaDescription, url: "/", siteName: profile.name, type: "website" },
  twitter: { card: "summary_large_image", title, description: profile.metaDescription },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

// Applies the saved (or system) theme before the page paints, so there is no flash.
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <noscript><style>{`.reveal{opacity:1!important;transform:none!important}`}</style></noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
