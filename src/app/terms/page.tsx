import StaticPage from "@/components/static-page/StaticPage";
import { Text } from "@/components/text/Text";

export const metadata = {
  title: "Termos e Condições | Touge",
};

export default function TermsPage() {
  return (
    <StaticPage
      title="Termos e Condições"
      subtitle="Última atualização: a definir"
    >
      <Text variant="body">
        Ao utilizar o site da Touge e realizar uma compra, você concorda com
        os termos descritos abaixo.
      </Text>
      <Text variant="body">
        Os preços exibidos podem ser alterados sem aviso prévio. O valor
        cobrado é sempre o exibido no momento da finalização da compra, no
        checkout.
      </Text>
      <Text variant="body">
        O pagamento e o processamento do pedido são realizados pela Shopify.
        A Touge não armazena dados completos de cartão de crédito em seus
        próprios servidores.
      </Text>
      <Text variant="body">
        Reservamo-nos o direito de cancelar pedidos em caso de indisponibilidade
        de estoque, suspeita de fraude ou erro evidente de preço.
      </Text>
    </StaticPage>
  );
}
