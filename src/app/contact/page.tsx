import StaticPage from "@/components/static-page/StaticPage";
import { Text } from "@/components/text/Text";

export const metadata = {
  title: "Contato | Touge",
};

export default function ContactPage() {
  return (
    <StaticPage
      title="Fale Conosco"
      subtitle="Dúvidas, sugestões ou problemas com seu pedido? Estamos por aqui."
    >
      <Text variant="body">
        <strong>E-mail:</strong> contato@hygg.com.br
      </Text>
      <Text variant="body">
        <strong>WhatsApp:</strong> (11) 90000-0000
      </Text>
      <Text variant="body">
        <strong>Horário de atendimento:</strong> Segunda a sexta, das 9h às
        18h
      </Text>
      <Text variant="bodySm" classname="text-neutral-500">
        Pedidos e pagamentos são processados diretamente pela Shopify;
        dúvidas sobre um pedido específico podem ser tratadas por aqui ou
        pelo e-mail de confirmação que você recebeu no checkout.
      </Text>
    </StaticPage>
  );
}
