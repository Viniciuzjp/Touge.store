import StaticPage from "@/components/static-page/StaticPage";
import { Text } from "@/components/text/Text";

export const metadata = {
  title: "Trocas e Devoluções | Touge",
};

export default function ReturnsPage() {
  return (
    <StaticPage title="Trocas e Devoluções">
      <Text variant="body">
        Conforme o Código de Defesa do Consumidor, você tem até 7 dias
        corridos após o recebimento do produto para solicitar a devolução por
        arrependimento, sem custo adicional.
      </Text>
      <Text variant="body">
        Também aceitamos trocas em caso de produto com defeito ou enviado
        incorretamente, em até 30 dias após o recebimento.
      </Text>
      <Text variant="body">
        Para solicitar uma troca ou devolução, entre em contato pelo{" "}
        <a href="/contact">nosso canal de atendimento</a> informando o número
        do pedido. O reembolso é feito pelo mesmo meio de pagamento utilizado
        na compra, em até 10 dias úteis após a aprovação.
      </Text>
    </StaticPage>
  );
}
