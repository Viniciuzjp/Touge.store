import { Container, Section, Stack } from "@av-digital/components";
import { Text } from "@/components/text/Text";
import { ProductGrid } from "@/design-system/layout/Productgrid";
import ProductCard from "@/design-system/layout/ProductCard";
import { getProducts } from "@/lib/shopify";

export const metadata = {
  title: "Categorias | Touge",
};

export default async function CategoriesPage() {
  const products = await getProducts(8);

  return (
    <Container size="xl">
      <Section>
        <Stack gap="lg" classname="py-12">
          <Stack gap="sm">
            <Text variant="h1">Categorias</Text>
            <Text variant="bodyLg" classname="text-neutral-600">
              Ainda estamos organizando nosso catálogo em categorias. Enquanto
              isso, confira alguns dos produtos disponíveis na loja.
            </Text>
          </Stack>

          <ProductGrid className="gap-x-8 gap-y-14">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        </Stack>
      </Section>
    </Container>
  );
}
