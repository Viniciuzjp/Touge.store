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
    return (
      <></>
    );
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
            "Alguns itens do seu carrinho não estão mais disponíveis e foram removidos. Revise seu carrinho e tente novamente."
          );
        } else {
          alert(
            data?.error || `Erro ao iniciar checkout (${response.status}).`
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
        <Button onClick={HandleCheckout} className="w-full"><Text variant="bodyLg">Finalizar Compra</Text></Button>
          <Flex
            direction="column"
            gap="xs"
            className="w-full rounded-md border border-amber-300 bg-amber-50 p-4 mt-4"
          >
            <Flex align="center" gap="sm">
              <TriangleAlert size={18} className="shrink-0 text-amber-700" />
              <Text variant="label" classname="text-amber-800">
                Loja em desenvolvimento — senha: 1234
              </Text>
            </Flex>
            <Text variant="bodySm" classname="text-amber-700">
              Ao digitar a senha você será levado para a home da loja. Volte
              a esta página e clique em &quot;Finalizar Compra&quot; de
              novo — o checkout funciona normalmente a partir daqui.
            </Text>
          </Flex>
    </Flex>
  );
}