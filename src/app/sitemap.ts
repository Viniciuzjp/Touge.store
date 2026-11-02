import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/shopify";
import { productPath, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const STATIC_PATHS = [
  "", "/products", "/categories", "/categories/automotivo", "/categories/pilotos",
  "/deals", "/bestsellers", "/about", "/contact", "/faq", "/shipping", "/returns",
  "/privacy", "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts(250);
  return [
    ...STATIC_PATHS.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...products.map((p) => ({ url: `${SITE_URL}${productPath(p.id)}` })),
  ];
}

