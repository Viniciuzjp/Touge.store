"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";

const slides = [
  {
    desktop: "/images/Hero6.webp",
    link: "/products",
    mobile: "/images/HeroMB.webp",
    title: "Seleção especial",
  },
  {
    desktop: "/images/Hero4.png",
    link: "/products",
    mobile: "/images/HeroMB2.webp",
    title: "Ver coleção",
  },
  {
    desktop: "/images/Hero3.webp",
    link: "/products",
    mobile: "/images/HeroMB.webp",
    title: "Aproveitar",
  },
];

export default function Hero() {
  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}

        loop
        className="w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Link href={slide.link}>
            <div className="relative hidden w-full aspect-[1584/672] md:block">
              <Image
                src={slide.desktop}
                alt={slide.title}
                fill
                quality={95}
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
            <div className="relative w-full aspect-[928/1152] md:hidden">
              <Image
                src={slide.mobile}
                alt={slide.title}
                fill
                quality={95}
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
