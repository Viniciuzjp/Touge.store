import StaticPage from "@/components/static-page/StaticPage";
import { Text } from "@/components/text/Text";

export const metadata = {
  title: "Envios | Touge",
};

export default function ShippingPage() {
  return (
    <StaticPage title="Envios">
      <Text variant="body">
        O prazo e o valor do frete são calculados de acordo com o CEP de
        entrega e exibidos no momento do checkout, antes da confirmação do
        pagamento.
      </Text>
      <Text variant="body">
        Após a confirmação do pagamento, o pedido é preparado e despachado em
        até 2 dias úteis. O prazo de entrega estimado costuma ser de 5 a 7
        dias úteis para a maior parte do Brasil, podendo variar conforme a
        região.
      </Text>
      <Text variant="body">
        Assim que o pedido é enviado, você recebe um e-mail com o código de
        rastreio para acompanhar a entrega.
      </Text>
    </StaticPage>
  );
}
