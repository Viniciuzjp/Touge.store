import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Products } from "@/ui/shopifyinterface/interface";
import { getProducts } from "@/lib/shopify";
import { Text } from "@/components/text/Text";
import { Container, Flex, Grid, Section, Stack } from "@av-digital/components";
import ProductCard from "@/design-system/layout/ProductCard";

export default async function Releases() {
  const datashopify: Products[] = await getProducts(50, {
    sortKey: "CREATED_AT",
    reverse: true,
  });
  return (
    <>
      <Section spacing="lg">
        <Stack gap="lg">
          <div className="lg:hidden">
            <Flex justify="end" align="baseline" className="mb-15">
              <img className="w-full" src="/images/release3.webp" alt="logo" />
              <Link
                href="/products"
                className="absolute group flex items-center gap-2 p-5 text-neutral-600 hover:text-neutral-900 transition-colors mt-2"
              >
                <Text variant="bodyLg" classname="text-white">
                  Ver Tudo
                </Text>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-white" />
              </Link>
            </Flex>
          </div>
          <Container size="xl">
          <div className="max-lg:hidden">
            <Flex justify="between" className="mb-15">
              <Stack>
                <Text variant="bodyLg">Recém-chegados</Text>
                <Text variant="h2">Lançamentos</Text>
                <Text variant="bodyLg">
                  As últimas camisetas a chegar na coleção, direto do forno.
                </Text>
              </Stack>
              <Link
                href="/products"
                className="group flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mt-2"
              >
                <Text variant="bodyLg">Ver Tudo</Text>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Flex>
          </div>
          </Container>

          <Container size="xl">
            <Grid
              gap="sm"
              classname="grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
            >
              {datashopify.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Grid>
          </Container>
        </Stack>
      </Section>
    </>
  );
}
