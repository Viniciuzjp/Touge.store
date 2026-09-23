"use client";

import { useCart } from "@/app/Cart/ui/CartContext/Context";
import Button from "@/components/button/Button";
import { Text } from "@/components/text/Text";
import { Flex } from "@av-digital/components";
import { formatPrice } from "@/lib/currency";
import { TriangleAlert } from "lucide-react";

export default function CartProduct() {
  const { cart, total, handleDeleteProduct } = useCart();

  if (cart.length === 0) {
    return <></>;
  }

  async function HandleCheckout() {
    const lineItems = cart.map((item) => ({
      id: item.variantId,
      quantity: item.quantity,
    }));

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lineItems }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        console.error("Erro no servidor:", response.status, data);

        if (data?.invalidLineIndexes?.length) {
          data.invalidLineIndexes.forEach((index: number) => {
            const invalidItem = cart[index];
            if (invalidItem) handleDeleteProduct(invalidItem.id);
          });
          alert(
            "Alguns itens do seu carrinho não estão mais disponíveis e foram removidos. Revise seu carrinho e tente novamente.",
          );
        } else {
          alert(
            data?.error || `Erro ao iniciar checkout (${response.status}).`,
          );
        }
        return;
      }

      const data = await response.json();
      console.log("Sucesso:", data);

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        console.error("checkoutUrl não retornado pela API", data);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
    }
  }

  return (
    <Flex direction="column" className="w-full mt-10">
      <Flex justify="between" className="w-full">
        <Text variant="h3">Total do Carrinho:</Text>
        <Text variant="productPrice">
          {formatPrice(total, cart[0]?.currencyCode || "BRL")}
        </Text>
      </Flex>
      <Button onClick={HandleCheckout} className="w-full">
        <Text variant="bodyLg">Finalizar Compra</Text>
      </Button>
    </Flex>
  );
}
