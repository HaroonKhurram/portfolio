// The public address of the site. On Vercel it is picked up automatically;
// you can also set NEXT_PUBLIC_SITE_URL (for example, for a custom domain).
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || (vercel ? `https://${vercel}` : "http://localhost:3000");
