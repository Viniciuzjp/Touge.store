
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://tougeclub.store")
).replace(/\/$/, "");

export const SITE_NAME = "Touge";
export const SITE_DESCRIPTION =
  "Touge — camisetas oversized inspiradas na cultura automotiva.";

export function productPath(id: string) {
  return `/produtos/${encodeURIComponent(id)}`;
}
