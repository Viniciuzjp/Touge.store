"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Text } from "@/components/text/Text";
import { Section } from "@/design-system/layout/Section";
import { Flex, Stack } from "@av-digital/components";

const categories = [
  { src: "/images/Cars.png", alt: "AUTOMOTIVO", href: "/categories/automotivo" },
  { src: "/images/Pilots.png", alt: "PILOTOS", href: "/categories/pilotos" },
  { src: "/images/Films.png", alt: "FILMES", href: "/categories/filmes" },
  { src: "/images/Others.png", alt: "OUTROS", href: "/products" },
];

export default function Category() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  return (
    <Section>
      <Flex justify="between">
        <Stack>
          <Text variant="bodyLg">Seleção Especial</Text>
          <Text variant="h2">CATEGORIAS</Text>
          <Text variant="bodyLg">
            Fique de olho e observe de perto um catálogo diverso de novidades
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

      <div className="relative mt-8">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4 md:-ml-6">
            {categories.map((category) => (
              <div
                key={category.alt}
                className="min-w-0 shrink-0 grow-0 basis-[78%] pl-4 sm:basis-[55%] md:basis-[42%] md:pl-6 lg:basis-[32%]"
              >
                <Link
                  href={category.href}
                  className="group relative block aspect-[4/4] overflow-hidden rounded-md bg-neutral-100"
                >
                  <Image
                    src={category.src}
                    alt={category.alt}
                    fill
                    sizes="(max-width: 640px) 78vw, (max-width: 768px) 55vw, (max-width: 1024px) 42vw, 32vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-10 flex justify-center pb-5">
                    <Text variant="h3" classname="text-center text-white">
                      {category.alt}
                    </Text>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Categoria anterior"
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-900 shadow-md transition-transform hover:scale-105"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Próxima categoria"
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-900 shadow-md transition-transform hover:scale-105"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </Section>
  );
}
