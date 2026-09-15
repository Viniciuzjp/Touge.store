"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Text } from "@/components/text/Text";
import { Container } from "@/design-system/layout/Container";
import { Section } from "@/design-system/layout/Section";
import { Button, Flex, Stack } from "@av-digital/components";

const images = [
  { src: "/images/Cars.png", alt: "Automotivo", href: "/products" },
  { src: "/images/Pilots.png", alt: "Pilotos", href: "/products" },
  { src: "/images/Films.png", alt: "Filmes", href: "/products" },
  { src: "/images/Others.png", alt: "Outros", href: "/products" },
];

const CARD_WIDTH = 190;

export default function Cat() {
  const [mounted, setMounted] = useState(false);
  const duplicated = [...images, ...images, ...images];

  const [index, setIndex] = useState(images.length);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (index >= images.length * 2) {
      setTimeout(() => {
        setAnimate(false);
        setIndex(images.length);
      }, 300);
    }

    if (index <= images.length - 1) {
      setTimeout(() => {
        setAnimate(false);
        setIndex(images.length * 2 - 1);
      }, 300);
    }
  }, [index]);

  useEffect(() => {
    if (!animate) {
      requestAnimationFrame(() => setAnimate(true));
    }
  }, [animate]);

  if (!mounted) return null;

  return (
    <>
      <Section>
        <Flex justify="between">
          <Stack>
            <Text variant="bodyLg">Seleção Especial</Text>
            <Text variant="h2">Cetegorias</Text>
            <Text variant="bodyLg">
              Fique de olho e observe de perto um catálogo diverso de novidades
            </Text>
          </Stack>

          <Link
            href="/products"
          >
            <Text variant="body" classname="text-white">
              Ver Tudo
            </Text>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </Flex>

        <Text variant="body">
          Procure por tudo que precisar por cada categoria.
        </Text>
      </Section>
      <Section>
        <div className="relative ">
          <Button
            onClick={() => setIndex((i) => i - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow flex items-center justify-center text-2xl"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </Button>

          <div className="overflow-hidden">
            <div
              className="flex"
              style={{
                transform: `translateX(-${index * CARD_WIDTH}px)`,
                transition: animate ? "transform 0.4s ease" : "none",
              }}
            >
              {duplicated.map((item, i) => (
                <div key={i} className="min-w-[280px] px-4">
                  <Link href={item.href}>
                  <div className="relative aspect-square rounded-full overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-20 text-white text-xl font-semibold">
                      {item.alt}
                    </div>
                  </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={() => setIndex((i) => i + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow flex items-center justify-center text-2xl"
          >
            <ArrowRight className="w-4 h-4 text-white" />
          </Button>
        </div>
      </Section>
    </>
  );
}
