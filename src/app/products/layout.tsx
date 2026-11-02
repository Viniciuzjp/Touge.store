import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produtos | Touge",
  description: "Todas as camisetas oversized da Touge, inspiradas na cultura automotiva.",
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
