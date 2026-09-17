"use client";

import { Flex, Stack } from "@av-digital/components";
import { Heart, ShoppingCart, User, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Dropdown from "@/components/dropdown/Dropdown";

export default function Header() {
  return (
    <>
      <header className="sticky top-0 w-full z-10 px-5 py-4 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
        <Flex align="center" justify="between">
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

          <Flex justify="between" align="center" gap="sm">
            <Link
              href="/products"
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              Produtos
            </Link>
            <Stack>
              <Dropdown></Dropdown>
            </Stack>
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
