import Cat from "@/ui/Main/Category/Category";
import Hero from "@/ui/Main/Hero/Hero";
import Info from "@/ui/Main/Info/Info";
import Offer from "@/ui/Main/Offer/Offers";
import ProductsSkeleton from "@/design-system/layout/ProductsSkeleton";
import Releases from "@/ui/Main/Release/Release";
import Send from "@/ui/Main/Send/Send";
import VideoBanner from "@/ui/Main/VideoBanner/VideoBanner";
import { Suspense } from "react";
import { Container } from "@av-digital/components";

export default function Home() {
  return (
    <>
      <main className="min-h-screen">
        <Hero />
        
        <Container size="xl">
          <Info />
        </Container>

        <Suspense fallback={<ProductsSkeleton />}>
          <Offer />
        </Suspense>

        <Container size="xl">
          <Cat />
        </Container>
        <Suspense fallback={<ProductsSkeleton />}>
          <Releases />
        </Suspense>
        <VideoBanner />
        <Send />
      </main>
    </>
  );
}
