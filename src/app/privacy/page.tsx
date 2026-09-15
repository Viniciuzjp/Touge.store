import StaticPage from "@/components/static-page/StaticPage";
import { Text } from "@/components/text/Text";

export const metadata = {
  title: "Política de Privacidade | Touge",
};

export default function PrivacyPage() {
  return (
    <StaticPage
      title="Política de Privacidade"
      subtitle="Última atualização: a definir"
    >
      <Text variant="body">
        Coletamos apenas os dados necessários para processar seu pedido, como
        nome, e-mail, endereço de entrega e informações de pagamento. O
        pagamento em si é processado diretamente pela Shopify, que segue seus
        próprios padrões de segurança e privacidade.
      </Text>
      <Text variant="body">
        Não vendemos nem compartilhamos seus dados pessoais com terceiros
        para fins de marketing. Usamos ferramentas de análise (como o Google
        Analytics) para entender como o site é utilizado e melhorar a
        experiência de compra.
      </Text>
      <Text variant="body">
        Você pode solicitar a exclusão dos seus dados a qualquer momento
        entrando em contato pelo e-mail contato@hygg.com.br.
      </Text>
    </StaticPage>
  );
}
