import Link from "next/link";
import Image from "next/image";
import { Text } from "@/components/text/Text";
import { Container, Grid, Stack } from "@av-digital/components";

export default function Footer() {
  return (
    <>
      <footer className="bg-gray-100 py-16">
        <Container size="xl">
          <Grid classname="grid-cols-1 md:grid-cols-4" gap="lg">
            <Stack>
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo.png"
                  alt="Touge"
                  width={1828}
                  height={860}
                  priority
                  className="h-10 w-auto"
                />
              </Link>
              <Text variant="bodySm" classname="text-gray-600">
                Apresentendo o Touge, uma plataforma de e-commerce que oferece
                uma experiência de compra online excepcional. Com uma ampla
                variedade de produtos, uma navegação intuitiva e uma experiência
                de compra rápida e fácil, o Touge torna a compra online uma
                experiência agradável e conveniente.
              </Text>
            </Stack>

            <Stack>
              <Text variant="h2">Shop</Text>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link
                    href="/categories"
                    className="hover:text-black transition-colors"
                  >
                    Todas as Categorias
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="hover:text-black transition-colors"
                  >
                    Novidades
                  </Link>
                </li>
                <li>
                  <Link
                    href="/deals"
                    className="hover:text-black transition-colors"
                  >
                    Melhores Ofertas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bestsellers"
                    className="hover:text-black transition-colors"
                  >
                    Mais Vendidos
                  </Link>
                </li>
              </ul>
            </Stack>

            <Stack>
              <Text variant="h2">Suporte</Text>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-black transition-colors"
                  >
                    Contatos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping"
                    className="hover:text-black transition-colors"
                  >
                    Envios
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns"
                    className="hover:text-black transition-colors"
                  >
                    Retornos e Reembolsos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-black transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </Stack>

            <Stack>
              <Text variant="h2">Compania</Text>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-black transition-colors"
                  >
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-black transition-colors"
                  >
                    Politicas de Privacidade
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-black transition-colors"
                  >
                    Termos e Condições
                  </Link>
                </li>
              </ul>
            </Stack>
          </Grid>

          <div className="border-t border-gray-300 mt-12 pt-8 text-center">
            <Text variant="bodySm">
              © {new Date().getFullYear()} Touge. todos os direitos são
              unicamente e exclusivamente reservados por WebTouge Inc. Todos os
              direitos de imagem e marca registrada pertencem aos seus
              respectivos donos.
            </Text>
          </div>
        </Container>
      </footer>
    </>
  );
}
