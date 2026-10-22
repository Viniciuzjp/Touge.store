"use client";

import { useCart } from "@/app/Cart/ui/CartContext/Context";
import { Button, Stack } from "@av-digital/components";
import Card from "@/components/card/card";
import { Flex } from "@av-digital/components";
import { Ban, Minus, Plus, Trash } from "lucide-react";
import Image from "next/image";
import { Text } from "@/components/text/Text";
import { formatPrice } from "@/lib/currency";

export default function CartProduct() {
  const {
    cart,
    handleDeleteProduct,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    total,
  } = useCart();

  const calculateSubtotal = (price: string, quantity: number) => {
    return (Number(price) * quantity).toFixed(2);
  };

  if (cart.length === 0) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        gap="sm"
        className="w-full py-16 text-center"
      >
        <Ban size={48} strokeWidth={2} className="text-neutral-400" />
        <Text variant="h2" classname="text-neutral-600">
          SEU CARRINHO ESTÁ VAZIO
        </Text>
      </Flex>
    );
  }

  return (
    <Stack gap="md">
      {cart.map((p) => (
        <Card key={p.id}>
          <Flex
            gap="md"
            justify="between"
            className="max-sm:flex-col max-sm:items-start"
          >
            <Flex gap="md" className="min-w-0">
              {p.image?.src && (
                <Image
                  src={p.image.src || "/placeholder.svg"}
                  alt={p.image.altText || p.title}
                  width={80}
                  height={80}
                  className="h-16 w-16 shrink-0 rounded object-cover sm:h-20 sm:w-20"
                />
              )}
              <Flex direction="column" align="start" className="min-w-0" gap="xs">
                <Text variant="bodyLg" classname="line-clamp-2 break-words">
                  {p.title}
                </Text>
                {p.variantTitle && (
                  <Text variant="bodySm" classname="uppercase text-neutral-500">
                    {p.variantTitle}
                  </Text>
                )}
                <Text variant="body" classname="text-neutral-600">
                  {formatPrice(p.price, p.currencyCode)}
                </Text>
              </Flex>
            </Flex>

            <Flex
              align="center"
              justify="between"
              gap="sm"
              className="w-full flex-wrap gap-y-2 sm:w-auto sm:flex-nowrap"
            >
              <div className="flex shrink-0 items-center overflow-hidden rounded-md border border-neutral-300">
                <Button
                  aria-label="Diminuir quantidade"
                  onClick={() => decreaseQuantity(p.id)}
                  className="!p-0 flex h-9 w-9 items-center justify-center rounded-none"
                >
                  <Minus size={16} color="white" />
                </Button>
                <input
                  type="number"
                  min="1"
                  value={p.quantity}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value) || 1;
                    updateQuantity(p.id, value);
                  }}
                  className="h-9 w-12 border-x border-neutral-300 text-center text-neutral-600 outline-0"
                />
                <Button
                  variant="secondary"
                  aria-label="Aumentar quantidade"
                  onClick={() => increaseQuantity(p.id)}
                  className="!p-0 flex h-9 w-9 items-center justify-center rounded-none"
                >
                  <Plus size={16} color="black" />
                </Button>
              </div>

              <Button
                aria-label="Remover produto"
                onClick={() => handleDeleteProduct(p.id)}
                className="!p-0 flex h-9 w-9 shrink-0 items-center justify-center"
              >
                <Trash size={16} color="white" />
              </Button>
            </Flex>
          </Flex>

          <Flex justify="between" gap="sm" className="flex-wrap">
            <Text variant="label">
              Subtotal ({p.quantity} {p.quantity === 1 ? "item" : "itens"}):
            </Text>
            <Text variant="bodyLg">
              {formatPrice(calculateSubtotal(p.price, p.quantity), p.currencyCode)}
            </Text>
          </Flex>
        </Card>
      ))}
    </Stack>
  );
}
