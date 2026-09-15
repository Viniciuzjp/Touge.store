import { Container, Section, Stack } from "@av-digital/components";
import { Text } from "@/components/text/Text";
import { ProductGrid } from "@/design-system/layout/Productgrid";
import ProductCard from "@/design-system/layout/ProductCard";
import { getProducts } from "@/lib/shopify";

export const metadata = {
  title: "Ofertas | Touge",
};

export default async function DealsPage() {
  const products = await getProducts(8);

  return (
    <Container size="xl">
      <Section>
        <Stack gap="lg" classname="py-12">
          <Stack gap="sm">
            <Text variant="h1">Ofertas</Text>
            <Text variant="bodyLg" classname="text-neutral-600">
              Nenhuma promoção ativa no momento. Volte em breve — enquanto
              isso, dá uma olhada no que já temos disponível.
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
