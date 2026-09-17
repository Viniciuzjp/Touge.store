import Link from "next/link";
import { Container, Section, Stack } from "@av-digital/components";
import { Text } from "@/components/text/Text";
import { ProductGrid } from "@/design-system/layout/Productgrid";
import ProductCard from "@/design-system/layout/ProductCard";
import { getCollectionByHandle } from "@/lib/shopify";

const FALLBACK_LABELS: Record<string, string> = {
  automotivo: "Automotivo",
  pilotos: "Pilotos",
  filmes: "Filmes",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);
  const label = collection?.title ?? FALLBACK_LABELS[handle] ?? handle;

  return { title: `${label} | Touge` };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);
  const label = collection?.title ?? FALLBACK_LABELS[handle] ?? handle;
  const products = collection?.products ?? [];

  return (
    <Container size="xl">
      <Section>
        <Stack gap="lg" classname="py-12">
          <Stack gap="sm">
            <Text variant="h1">{label}</Text>
            {products.length === 0 && (
              <Text variant="bodyLg" classname="text-neutral-600">
                Ainda não temos produtos cadastrados nessa categoria. Enquanto
                isso, confira{" "}
                <Link href="/products" className="underline">
                  todo o catálogo
                </Link>
                .
              </Text>
            )}
          </Stack>

          {products.length > 0 && (
            <ProductGrid className="gap-x-8 gap-y-14">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductGrid>
          )}
        </Stack>
      </Section>
    </Container>
  );
}
