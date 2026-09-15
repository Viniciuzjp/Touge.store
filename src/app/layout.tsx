import type { Metadata } from "next";
import Header from "@/ui/Header/Header";
import "./globals.css";
import "@av-digital/components/styles";
import Footer from "@/ui/Footer/Footer";
import { Inter } from "next/font/google";
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ["latin"],
});

import Script from "next/script";
import { CartProvider } from "@/app/Cart/ui/CartContext/Context";

export const metadata: Metadata = {
  title: "Touge",
  description: "Touge — camisetas oversized inspiradas na cultura automotiva.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N8P0DYJMMB"
          strategy="afterInteractive"
        />

        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N8P0DYJMMB', { debug_mode: true });
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <CartProvider>
          <Header />
          {children}
          <SpeedInsights />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
