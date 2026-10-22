"use client";

import { useCart } from "@/app/Cart/ui/CartContext/Context";
import Button from "@/components/button/Button";
import { Text } from "@/components/text/Text";
import { Flex } from "@av-digital/components";
import { formatPrice } from "@/lib/currency";
import { TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartProduct() {
  const { cart, total, handleDeleteProduct } = useCart();
  const [loading, setLoading] = useState(false);

  // Ao voltar do checkout, o navegador restaura a página do cache com o botão travado.
  useEffect(() => {
    const reset = (e: PageTransitionEvent) => e.persisted && setLoading(false);
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  if (cart.length === 0) {
    return <></>;
  }

  async function HandleCheckout() {
    if (loading) return;
    setLoading(true);

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
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.checkoutUrl) {
        // Mantém o botão desativado enquanto o navegador sai da página.
        window.location.href = data.checkoutUrl;
      } else {
        console.error("checkoutUrl não retornado pela API", data);
        alert("Não foi possível iniciar o pagamento. Tente novamente.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Falha de conexão ao iniciar o pagamento. Verifique sua internet e tente novamente.");
      setLoading(false);
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
      <Button onClick={HandleCheckout} disabled={loading} className="w-full">
        <Text variant="bodyLg">{loading ? "Redirecionando..." : "Finalizar Compra"}</Text>
      </Button>
    </Flex>
  );
}
