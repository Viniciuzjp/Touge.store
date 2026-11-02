# Auditoria de E-commerce — Touge

Data: 27/10/2026 · Escopo: repositório `shopcase` (branch `Main`, a partir do commit `3700818`) e loja Shopify `tougeclub.myshopify.com`.

## 1. Resumo executivo

**Avaliação: PRONTA APÓS PENDÊNCIAS.**

A parte técnica está adequada para uma operação inicial. O site compila sem avisos, as páginas principais funcionam em desktop e celular, e o fluxo produto → carrinho → checkout oficial da Shopify foi validado de ponta a ponta no navegador. O checkout abre com os itens, as variantes e o total corretos. A Shopify já oferece frete ("Padrão"), cartão de crédito com parcelamento, PayPal e Pix (Appmax).

A loja **ainda não está pronta para vender** por motivos comerciais e jurídicos que dependem do proprietário:

1. **Chave de API da CJ Dropshipping exposta em repositório público.** Precisa ser trocada (rotacionada).
2. **Falta identificação do vendedor:** razão social, CNPJ/CPF e endereço, exigidos pelo Decreto nº 7.962/2013.
3. **Políticas de trocas, envio e termos não cadastradas na Shopify,** e as páginas do site estão incompletas. Os rascunhos estão em `docs/legal/`.
4. **Checkout em inglês,** porque a loja só tem o idioma inglês publicado.
5. **Prazo real de entrega desconhecido.** As promessas de prazo publicadas sem fonte foram removidas.

Uma compra real **não foi feita** (por regra desta auditoria). O pagamento está *tecnicamente integrado* e *acessível*, mas não *validado com transação*.

## 2. Arquitetura

- **Stack:** Next.js 16.4.3 (App Router, Turbopack), React 19.1, TypeScript 5, Tailwind CSS 4, SCSS Modules e a biblioteca interna `@av-digital/components`. Hospedagem prevista na Vercel (`@vercel/speed-insights`).
- **Backend próprio:** não existe. Não há banco de dados nem autenticação própria. Produtos, preços, estoque, checkout, pagamentos, pedidos e contas de cliente são todos da Shopify.

```
Shopify Storefront API (2026-04)
 │
 ├─ src/lib/shopify.ts ── getProducts / getCollectionByHandle (cache de 5 min)
 │     ├─ servidor: home (Offers, Releases), /deals, /bestsellers, /categories, /categories/[handle], sitemap
 │     └─ navegador: /products e "Você pode gostar" (token público NEXT_PUBLIC_*)
 │
 ├─ getProductById
 │     ├─ /api/products/[id] (sem cache: preço e estoque ao vivo) ← /produtos/[id] (página client)
 │     └─ /produtos/[id]/layout.tsx (servidor: título, Open Graph, JSON-LD; cache de 5 min)
 │
 ├─ CartContext (src/app/Cart/ui/CartContext) + regras em src/lib/cart.ts
 │     └─ localStorage "cart" (sem dados pessoais), sincronizado entre abas
 │
 └─ POST /api/checkout (token só no servidor) → cartCreate @inContext(BR, PT_BR)
       └─ checkoutUrl → checkout oficial da Shopify (frete, pagamento, e-mails, pedido)
             └─ contas de cliente: shopify.com/78258995418/account
```

**Caminho dos dados até a compra.** O catálogo vem da Storefront API, e o card do produto leva a `/produtos/<gid>`. A página busca o produto ao vivo, e o cliente escolhe a variante. O carrinho guarda o id da variante, a quantidade e um snapshot do preço, que serve **só para exibição**. "Finalizar compra" recria o carrinho na Shopify com ids e quantidades, e a Shopify calcula preço, frete e total finais no checkout.

**Integrações externas:**
- Shopify: catálogo, checkout, pedidos, contas e newsletter (`customerCreate`).
- Google Analytics 4 (`G-N8P0DYJMMB`).
- Vercel Speed Insights.
- Gateways de pagamento: PayPal, Appmax (Pix) e o processador de cartão configurado na Shopify.
- A pasta mostra vestígios da CJ Dropshipping (variáveis `CJ_*` no `.env`, `server.js` no histórico), mas o app não a usa.

## 3. Jornada do cliente (resultado)

| Etapa | Estado | Evidência |
|---|---|---|
| Home, catálogo, categorias, ofertas, mais vendidos | PASSOU | 15 rotas × 2 viewports (1440 e 390 px) sem erro de JS, sem imagem quebrada, sem rolagem horizontal |
| Links internos | PASSOU | 28 links verificados, nenhum com erro (o `/wishlist` quebrado foi removido) |
| Página de produto | PASSOU | Carrega pelo card; variantes (cor/tamanho) e estado "esgotado"; título, descrição, canonical e JSON-LD gerados |
| Produto inexistente | PASSOU | Mostra "Produto não encontrado" com link para o catálogo |
| Carrinho: adicionar, variantes, +/−, remover, total | PASSOU | M e L em linhas separadas; quantidade soma; total = soma das linhas |
| Carrinho: entradas inválidas | PASSOU | −5, 0, vazio → 1; 999999 → 99; item não é apagado |
| Carrinho: recarregar e várias abas | PASSOU | Persiste após recarregar; reflete alteração feita em outra aba |
| Geração do checkout | PASSOU | `cartCreate` → `/checkouts/cn/...` ("Checkout - Touge"), total R$ 239,97 = 3 × R$ 79,99 |
| Frete no checkout | PASSOU (API) | Opção "Padrão" R$ 22,00 para CEP 01310-100 |
| Meios de pagamento | PASSOU (visual) | Cartão (com parcelas), PayPal e "Pix, oferecido por Appmax" aparecem no checkout |
| Compra real / aprovação de pagamento | NÃO VALIDADO | Proibido nesta auditoria; ver procedimento em `PRODUCTION_CHECKLIST.md` |
| Pós-compra (e-mails, rastreio) | NÃO VALIDADO | Feito pela Shopify e pelo app de fulfillment; depende de pedido real |
| Idioma do checkout | FALHOU | Abre em `/en-br`: a loja só tem inglês publicado |
| Login da conta do cliente | PASSOU, com ressalva | Abre o login da Shopify, mas com o nome "**Shopcase**", não "Touge" |
| Newsletter | Validação: PASSOU · Inscrição: NÃO VALIDADO | Entradas inválidas → 400; o caminho de sucesso cria um cliente real na Shopify e não foi executado |

## 4. Problemas encontrados (P0–P3)

Legenda de estado: **CORRIGIDO** (aplicado e testado), **PENDENTE** (depende do proprietário), **ACEITO** (risco conhecido, documentado).

### P0 — Bloqueador de produção

| ID | Problema | Evidência | Impacto | Estado |
|---|---|---|---|---|
| P0-01 | `next@16.1.1` com vulnerabilidades críticas, incluindo execução remota de código sem autenticação na otimização de imagens (AVIF e SVG) | `npm audit`: 1 crítica e 6 altas em dependências de produção; o site usa `next/image` com imagens remotas | Comprometimento do servidor | **CORRIGIDO**: Next 16.4.3 via `npm audit fix` (sem quebra de versão); `npm audit` = 0 vulnerabilidades; build e testes repetidos |

### P1 — Corrigir antes do lançamento

| ID | Problema | Evidência | Impacto | Estado |
|---|---|---|---|---|
| P1-01 | `CJ_API_KEY` exposta (vulnerabilidade comprovada) | Está no `server.js` dos commits `0546a69` e `55f54ae`; o repositório `github.com/Viniciuzjp/WebShopcase` é público e o arquivo pode ser baixado pelo GitHub | Terceiros podem usar a conta da CJ (pedidos, saldo, dados) | **PENDENTE**: rotacionar a chave no painel da CJ. Reescrever o histórico não substitui a rotação |
| P1-02 | Vendedor não identificado | Nenhuma página tem razão social, CNPJ/CPF ou endereço; o rodapé cita "WebTouge Inc." | Descumpre o art. 2º do Decreto 7.962/2013 e reduz a confiança | **PENDENTE**: dados do proprietário |
| P1-03 | Informações fictícias ou sem fonte publicadas | WhatsApp `(11) 90000-0000`; "5–7 dias úteis" no carrinho, FAQ e Envios; "despacho em até 2 dias úteis"; "boleto" no FAQ (não existe no checkout) | Oferta enganosa, reclamações e chargebacks | **CORRIGIDO**: textos removidos ou trocados por "calculado no checkout"; FAQ lista só os meios vistos no checkout. O e-mail `contato@hygg.com.br` e o horário de atendimento seguem **PENDENTES** de confirmação |
| P1-04 | Políticas ausentes ou incompletas | A Shopify tem só a Privacy Policy (modelo em inglês); Refund, Shipping e Terms não estão cadastradas; as páginas `/terms` e `/privacy` dizem "a definir" | O checkout não mostra políticas; a privacidade não atende à LGPD | **PENDENTE**: rascunhos em `docs/legal/` com campos `[PREENCHER]` |
| P1-05 | Checkout em inglês | URL `/checkouts/cn/.../en-br`; `localization.availableLanguages = [EN]` | Abandono e dúvida do cliente brasileiro | **PENDENTE**: publicar Português na Shopify. O código já envia `@inContext(language: PT_BR)` |
| P1-06 | Prazo para produto com defeito abaixo do CDC | `/returns` dizia "em até 30 dias"; roupa é bem durável (90 dias, CDC art. 26, II) | Cláusula que restringe direito legal | **CORRIGIDO**: o texto passa a remeter aos prazos do CDC |
| P1-07 | Origem do envio e prazo real desconhecidos | Indícios de dropshipping (CJ); a Shopify só informa "Padrão" R$ 22 | Prazos prometidos podem ser impossíveis de cumprir | **PENDENTE**: o proprietário informa a origem e os prazos reais |

> Corrigido antes desta auditoria (commit `3700818`): o carrinho juntava variantes diferentes do mesmo produto (o cliente recebia o tamanho errado), o catálogo ficava congelado no build, o checkout aceitava duplo clique e o GA4 estava em modo de depuração. Esses pontos foram revalidados aqui.

### P2 — Importante, não bloqueante

| ID | Problema | Estado |
|---|---|---|
| P2-01 | Quantidade negativa apagava o item; quantidade sem limite (999999 chegava ao checkout) | **CORRIGIDO**: limite de 1 a 99 no cliente e no servidor |
| P2-02 | `Text` renderizava tudo como `<h1>` (60 na home; o primeiro de toda página era "Vestuário") | **CORRIGIDO**: títulos geram `h1`–`h4`, o restante gera `<p>`; 1 `h1` por página |
| P2-03 | Sem `sitemap.xml` e `robots.txt`; `/products`, `/Cart` e produtos sem título próprio; sem Open Graph ou dados estruturados | **CORRIGIDO**: exige `NEXT_PUBLIC_SITE_URL` em produção (ver checklist) |
| P2-04 | Menu "Vestuário" só abria com o mouse: categorias inacessíveis no celular e no teclado | **CORRIGIDO**: abre por toque e teclado e cabe na tela de 390 px |
| P2-05 | Erros do checkout mostrados em inglês ou como "[object Object]"; corpo inválido gerava 500 | **CORRIGIDO**: mensagens em português; 400 e 502 conforme o caso |
| P2-06 | Gravação do carrinho durante o carregamento e abas sobrescrevendo uma à outra | **CORRIGIDO** |
| P2-07 | `npm run lint` quebrado (`next lint` foi removido no Next 16) e o ESLint varria `.next/` (12.517 "problemas") | **CORRIGIDO**: 0 erros e 2 avisos (P3) |
| P2-08 | `images.domains` obsoleto e liberando 5 hosts sem uso; sem headers de segurança | **CORRIGIDO**: só `cdn.shopify.com`; `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` |
| P2-09 | O carrinho local não é limpo após a compra (a compra acontece no domínio da Shopify) | **PENDENTE**: solução proposta na seção 7; não implementada porque não pode ser validada sem um pedido real |
| P2-10 | GA4 carrega sem aviso nem consentimento | **PENDENTE**: decisão do proprietário (`docs/legal/cookies-e-consentimento.md`) |
| P2-11 | Duas vitrines públicas: o tema da Shopify em `tougeclub.myshopify.com` continua aberto, e o checkout tem "Navigate to Online Store", que leva para lá | **PENDENTE**: configuração na Shopify e domínio próprio |
| P2-12 | Tela de login da conta do cliente com o nome "Shopcase" | **PENDENTE**: configuração na Shopify |
| P2-13 | Newsletter cria cliente via `customerCreate` sem limite de taxa | **ACEITO** (risco potencial): a Shopify aplica limites próprios; monitorar cadastros falsos |
| P2-14 | O preço salvo no carrinho pode ficar desatualizado até o checkout | **ACEITO**: o checkout da Shopify é a autoridade e mostra o valor correto antes do pagamento |
| P2-15 | Home e rodapé anunciam "Ofertas em destaque" e "Melhores ofertas" sem promoção ativa (a própria `/deals` diz que não há) | **PENDENTE**: decisão de texto do proprietário (risco de publicidade enganosa, CDC art. 37) |
| P2-16 | Coleção "Filmes" vazia, mas listada no menu e no carrossel | **PENDENTE**: cadastrar produtos ou ocultar o link |
| P2-17 | Página de produto inexistente mostrava "Erro ao buscar produto" | **CORRIGIDO** |

### P3 — Melhoria futura (não implementado)

- `<img>` em vez de `next/image` nos banners móveis de `Offers` e `Release` (2 avisos do lint).
- O vídeo do banner `videobmw.mp4` tem 18 MB; vale comprimir.
- O cabeçalho quebra em duas linhas no celular. Funciona, mas pode ser refinado.
- As URLs de produto usam o `gid` (`/produtos/gid%3A%2F%2F...`) em vez do `handle`. Funcionam, mas são piores para compartilhar.
- `eslint-config-next@15.4.6` está desalinhado com o Next 16, e o `components.json` (shadcn) ficou órfão.
- `NEXT_PUBLIC_STORE_PASSWORD` no `.env` não é usada; a senha da loja está desativada.
- A descrição do produto é injetada via `dangerouslySetInnerHTML`. Vem do próprio admin e nenhuma das 12 descrições tem `<script>` ou `on*=`. Risco potencial baixo.

### Pontos verificados sem problema

- O token Storefront presente no bundle público é um token **Storefront** (32 hexadecimais, não `shpat_`). Ele foi feito para exposição pública, então não é vulnerabilidade.
- `.env` nunca foi commitado e o `.gitignore` cobre `.env*`.
- Nenhum dado de cartão passa pelo site.
- O `localStorage` guarda só o carrinho, sem dados pessoais.
- Os logs não registram dados pessoais; o log que imprimia a resposta inteira do carrinho foi removido.

## 5. Causas raiz dos problemas crônicos

| Sintoma | Causa raiz | Correção |
|---|---|---|
| Página com dezenas de `h1` e semântica errada | Um único componente `Text` com a tag fixa `h1` | Mapeamento de tag por variante, mais a prop `as` |
| Carrinho com comportamento divergente (quantidades inválidas, apagar item) | Regras espalhadas no componente, sem testes | Regras puras em `src/lib/cart.ts` com 10 testes |
| Validação de checkout frágil | Validação inline na rota, sem testes | `src/lib/checkout.ts` com 6 testes |
| Informações comerciais contraditórias (prazos, meios de pagamento) | Textos fixos sem fonte, sem conferir a configuração da Shopify | Textos remetem ao checkout; pendências registradas para o proprietário |
| Vulnerabilidades e configuração obsoleta | Dependência sem atualização desde o início do projeto; configuração herdada do Next 15 | Atualização dentro de `^16`; `remotePatterns`; lint ajustado |

## 6. Testes executados

| Teste | Comando ou procedimento | Resultado |
|---|---|---|
| Dependências | `npm audit` (antes: 8 em produção, 1 crítica) | PASSOU: 0 vulnerabilidades |
| Tipos | `npx tsc --noEmit` | PASSOU |
| Lint | `npm run lint` | PASSOU: 0 erros, 2 avisos (P3) |
| Testes unitários | `npm test` (16 testes: carrinho e validação do checkout) | PASSOU: 16/16 |
| Build de produção | `npm run build` | PASSOU, sem avisos |
| Navegação (desktop e celular) | Chrome headless via DevTools Protocol, 15 rotas × 2 viewports | PASSOU |
| Fluxo de compra no navegador | Produto → variantes → carrinho → recarregar → abas → checkout | PASSOU (22 de 23 verificações; a 23ª foi um falso negativo do próprio teste, conferido separadamente) |
| API do checkout | Variante válida, inexistente, corpo inválido e quantidade fora do limite | PASSOU |
| Frete | `cartCreate` com endereço de teste (SP) | PASSOU: "Padrão" R$ 22,00 |
| Compra real, e-mails, rastreio | — | NÃO VALIDADO |
| Inscrição real na newsletter | — | NÃO VALIDADO (criaria cliente real) |
| Speed Insights | Só existe na Vercel (404 em `localhost`) | NÃO APLICÁVEL localmente |

Os scripts de navegador ficaram fora do repositório para não adicionar infraestrutura. O procedimento manual equivalente está no checklist.

## 7. Limitações e riscos restantes

- **Pagamento não validado com transação.** Faça um pedido de teste real e estorne-o, ou use o gateway de teste da Shopify, antes de divulgar a loja.
- **Carrinho após a compra (P2-09).** Solução recomendada:
  1. Ao criar o checkout, salvar o `cart.id` da Shopify no `localStorage`.
  2. Ao voltar ao site, consultar `cart(id)`.
  3. Se o carrinho não existir mais (foi convertido em pedido), limpar o carrinho local.

  Implementar e validar junto com o primeiro pedido de teste.
- **`NEXT_PUBLIC_SITE_URL`** precisa estar definida em produção; sem ela, canonical, Open Graph e sitemap usam o domínio da Vercel.
- **Este conjunto de correções não foi commitado nem publicado.**

## 8. Decisão

- **Prontidão técnica:** adequada para lançamento inicial.
- **Prontidão comercial e jurídica:** não adequada até concluir P1-01, P1-02, P1-04, P1-05 e P1-07 e validar um pedido real.

**Avaliação final: PRONTA APÓS PENDÊNCIAS.** O próximo passo está em `docs/OWNER_ACTIONS.md`.
