import type { Metadata } from "next";
import { getProductById, type Product } from "@/lib/shopify";
import { productPath, SITE_NAME } from "@/lib/site";

type Params = { params: Promise<{ id: string }> };

async function loadProduct(rawId: string): Promise<Product | null> {
  try {
    return await getProductById(decodeURIComponent(rawId), { revalidate: 300 });
  } catch {
    return null;
  }
}

function plainText(html: string, max = 160) {
  const text = html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const product = await loadProduct(id);
  if (!product) return { title: `Produto | ${SITE_NAME}` };

  const description = plainText(product.descriptionHtml) || product.title;
  const image = product.images[0];
  return {
    title: `${product.title} | ${SITE_NAME}`,
    description,
    alternates: { canonical: productPath(product.id) },
    openGraph: {
      title: product.title,
      description,
      url: productPath(product.id),
      images: image ? [{ url: image.src, width: image.width, height: image.height, alt: image.altText ?? product.title }] : [],
    },
  };
}

export default async function ProductLayout({ children, params }: Params & { children: React.ReactNode }) {
  const { id } = await params;
  const product = await loadProduct(id);

  const jsonLd = product && product.variants.length > 0 && {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.map((i) => i.src),
    description: plainText(product.descriptionHtml, 500),
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      sku: v.id,
      name: v.title,
      price: v.price.amount,
      priceCurrency: v.price.currencyCode,
      availability: v.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    })),
  };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      {children}
    </>
  );
}
