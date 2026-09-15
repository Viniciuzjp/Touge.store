"use client";

import { Flex } from "@av-digital/components";
import { Text } from "@/components/text/Text";
import { Heart, ShoppingCart, User, Wallet } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <header className="sticky top-0 w-full z-10 px-5 py-4 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
        <Flex align="center" justify="between">
          <Text variant="h2">
            <Link href="/">Touge</Link>
          </Text>

          <Flex justify="between" align="center" gap="sm">
            <Link
              href="/products"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              Produtos
            </Link>
          </Flex>

          <Flex justify="center" align="center" gap="sm">
            <Link href="/wishlist" className="hidden">
              <Heart className="h-5 w-5 text-gray-700" />
            </Link>
            <Link href="/Cart">
              <ShoppingCart className="h-5 w-5 text-gray-700" />
            </Link>
            <a href="https://shopify.com/78258995418/account/profile">
              <User className="h-5 w-5 text-gray-700" />
            </a>
            <a href="https://shopify.com/78258995418/account/orders">
              <Wallet className="h-5 w-5 text-gray-700" />
            </a>
          </Flex>
        </Flex>
      </header>
    </>
  );
}
