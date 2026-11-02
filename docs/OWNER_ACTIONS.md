# Ações do proprietário — Touge

Tudo aqui depende de você: acesso a contas, dados da empresa ou decisões comerciais. Os itens estão em ordem de prioridade; os marcados **[bloqueia lançamento]** devem ser concluídos antes de divulgar a loja.

## 1. Segurança

### 1.1 Rotacionar a chave da CJ Dropshipping [bloqueia lançamento]
- **Por quê:** a `CJ_API_KEY` está no `server.js` dos commits `0546a69` e `55f54ae` do repositório público `github.com/Viniciuzjp/WebShopcase`, e qualquer pessoa pode lê-la.
- **Próximo passo:**
  1. No painel da CJ, gere uma nova chave e revogue a antiga.
  2. Atualize `CJ_API_KEY` no `.env` local, se ainda usar o script da CJ.
  3. Opcional: torne o repositório privado. Isso não substitui a rotação, porque a chave pode já ter sido copiada.

### 1.2 Remover variável sem uso
- **Por quê:** `NEXT_PUBLIC_STORE_PASSWORD` no `.env` não é usada pelo código, e a senha da loja já está desativada. Variáveis `NEXT_PUBLIC_*` podem acabar no código público.
- **Próximo passo:** apagar a linha do `.env` e não cadastrá-la na Vercel.

## 2. Dados da empresa e atendimento

### 2.1 Identificação do vendedor [bloqueia lançamento]
- **Por quê:** o Decreto 7.962/2013 (art. 2º) exige, em local de destaque no site, o nome empresarial e o CNPJ (ou nome e CPF), o endereço físico e o eletrônico. Hoje nenhuma página tem esses dados, e o rodapé cita "WebTouge Inc.".
- **Próximo passo:** enviar:
  - razão social ou nome completo;
  - CNPJ ou CPF;
  - endereço completo;
  - se "WebTouge Inc." é uma empresa real (e de qual país) ou deve sair do rodapé.

  Com isso, os dados entram no rodapé e nas políticas.

### 2.2 Canais de contato [bloqueia lançamento]
- **Por quê:** o WhatsApp `(11) 90000-0000` era fictício e foi removido. O e-mail `contato@hygg.com.br` é de outro domínio, e o horário "segunda a sexta, 9h às 18h" não foi confirmado.
- **Próximo passo:**
  - Confirmar se o e-mail e o horário são reais e monitorados.
  - Se houver WhatsApp real, informar o número.
  - Usar o mesmo e-mail em *Shopify > Configurações > Notificações* (remetente dos e-mails de pedido).

## 3. Shopify

### 3.1 Publicar Português no checkout [bloqueia lançamento]
- **Por quê:** a loja só tem inglês publicado, então o checkout aparece em inglês ("Order summary", "Pay now"). O site já pede português; falta o idioma existir.
- **Próximo passo:** *Configurações > Idiomas*: adicionar e publicar **Português (Brasil)**, e de preferência torná-lo o idioma padrão. Depois, conferir se a URL do checkout termina em `/pt-br`.

### 3.2 Cadastrar as políticas [bloqueia lançamento]
- **Por quê:** a Shopify só tem a Privacy Policy, um modelo automático em inglês. Reembolso, Envio e Termos de Serviço estão vazios, então o checkout não exibe as condições de compra.
- **Próximo passo:**
  1. Completar os campos `[PREENCHER]` dos arquivos em `docs/legal/`.
  2. Revisar, de preferência com um advogado.
  3. Colar os textos em *Configurações > Políticas*.
  4. Atualizar as páginas `/privacy`, `/terms`, `/returns` e `/shipping` do site com o mesmo texto.

### 3.3 Prazo e origem do envio [bloqueia lançamento]
- **Por quê:** a Shopify oferece só a opção de frete "Padrão" (R$ 22,00 para SP). Não há fonte para o prazo real, e há indícios de dropshipping (CJ), que pode envolver envio internacional e prazos bem maiores. As promessas "5–7 dias" e "2 dias para despacho" foram removidas por isso.
- **Próximo passo:** informar:
  - de onde os produtos saem (estoque próprio, fornecedor nacional ou exterior);
  - o prazo de preparação;
  - o prazo de transporte;
  - a transportadora.

  Se possível, configure o prazo estimado na própria opção de frete da Shopify, para ele aparecer no checkout.

### 3.4 Pedido de teste real [bloqueia lançamento]
- **Por quê:** o checkout e os meios de pagamento (cartão com parcelas, PayPal, Pix/Appmax) aparecem, mas nenhuma transação foi feita. O fluxo pós-compra (e-mail de confirmação, pedido no admin, envio ao fornecedor, rastreio) também não foi verificado.
- **Próximo passo:** seguir o roteiro "Pedido de teste" em `docs/PRODUCTION_CHECKLIST.md`.

### 3.5 Nome da loja na conta do cliente
- **Por quê:** a tela de login (ícones de conta e pedidos do site) mostra "Fazer login – **Shopcase**", e não "Touge".
- **Próximo passo:** em *Configurações > Contas de cliente* e *Configurações > Detalhes da loja*, trocar o nome exibido para "Touge".

### 3.6 Vitrine duplicada
- **Por quê:** o tema da Shopify em `tougeclub.myshopify.com` continua público, e o checkout tem o link "Navigate to Online Store", que leva o cliente para lá em vez de para o site Next.js.
- **Próximo passo:**
  1. Registrar um domínio próprio e apontá-lo para a Vercel.
  2. Na Shopify, fazer o tema da loja online redirecionar para o domínio do site, ou proteger com senha a vitrine da Shopify, mantendo o checkout liberado (testar antes).

## 4. Decisões comerciais e de conteúdo

### 4.1 Cookies e Google Analytics
- **Por quê:** o GA4 carrega para todos os visitantes, sem aviso. A ANPD recomenda consentimento para cookies não essenciais.
- **Próximo passo:** escolher uma opção em `docs/legal/cookies-e-consentimento.md`. Recomendação: aviso simples com o Consent Mode do Google (o GA só grava cookies após o aceite).

### 4.2 Termos "Ofertas" e "Melhores ofertas"
- **Por quê:** a home ("Ofertas em destaque") e o rodapé ("Melhores Ofertas") anunciam ofertas, mas não há promoção ativa; a própria página `/deals` diz isso. Pode ser lido como publicidade enganosa (CDC art. 37).
- **Próximo passo:** trocar para "Destaques" ou "Seleção", ou criar promoções reais na Shopify.

### 4.3 Coleção "Filmes"
- **Por quê:** aparece no menu e no carrossel, mas está vazia.
- **Próximo passo:** cadastrar produtos na coleção `filmes` ou pedir para remover os links.

### 4.4 Política de trocas por tamanho
- **Por quê:** a lei não obriga troca por tamanho ou gosto fora do direito de arrependimento (7 dias). É uma decisão comercial: prazo, quem paga o frete, condições do produto.
- **Próximo passo:** decidir e preencher a seção correspondente em `docs/legal/trocas-devolucoes-reembolsos.md`.

### 4.5 Prazo de reembolso
- **Por quê:** o site promete reembolso "em até 10 dias úteis após a aprovação". Ninguém confirmou se isso é viável com os gateways (Appmax, PayPal, cartão).
- **Próximo passo:** confirmar com os gateways e manter ou ajustar o prazo.

## 5. Publicação

### 5.1 Variáveis de ambiente na Vercel [bloqueia lançamento]
- **Próximo passo:** cadastrar as variáveis listadas em `docs/PRODUCTION_CHECKLIST.md`, incluindo a nova `NEXT_PUBLIC_SITE_URL` com o domínio final.

### 5.2 Commit e deploy
- **Por quê:** as correções desta auditoria estão só na sua máquina, sem commit.
- **Próximo passo:** revisar com `git diff`, fazer commit, publicar e rodar o roteiro "Depois do deploy" do checklist.
