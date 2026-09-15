import StaticPage from "@/components/static-page/StaticPage";
import { Text } from "@/components/text/Text";

export const metadata = {
  title: "Perguntas Frequentes | Touge",
};

const FAQS = [
  {
    question: "Quais formas de pagamento vocês aceitam?",
    answer:
      "O pagamento é processado com segurança pela Shopify e aceita cartão de crédito, Pix e boleto, dependendo das opções configuradas para sua região.",
  },
  {
    question: "Quanto tempo leva para meu pedido chegar?",
    answer:
      "O prazo estimado é de 5 a 7 dias úteis após a confirmação do pagamento, podendo variar conforme a região de entrega.",
  },
  {
    question: "Posso trocar ou devolver um produto?",
    answer:
      "Sim. Você tem até 7 dias corridos após o recebimento para solicitar devolução por arrependimento. Veja mais detalhes na página de Trocas e Devoluções.",
  },
  {
    question: "Como acompanho meu pedido?",
    answer:
      "Assim que o pedido é despachado, enviamos um e-mail com o código de rastreio.",
  },
  {
    question: "Como falo com o suporte?",
    answer:
      "Pelo e-mail contato@hygg.com.br ou pela página de Contato.",
  },
];

export default function FaqPage() {
  return (
    <StaticPage title="Perguntas Frequentes">
      {FAQS.map((faq) => (
        <details
          key={faq.question}
          className="border-b border-neutral-200 py-3 group"
        >
          <summary className="cursor-pointer list-none">
            <Text variant="bodyLg" classname="inline">
              {faq.question}
            </Text>
          </summary>
          <Text variant="body" classname="text-neutral-600 mt-2">
            {faq.answer}
          </Text>
        </details>
      ))}
    </StaticPage>
  );
}
