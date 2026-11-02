# Checklist de produção — Touge

Estados: ✅ concluído · ⏳ pendente · ❌ falhou · ❔ não validado

## 1. Código e build (verificado em 27/10/2026)

| Item | Estado | Como verificar |
|---|---|---|
| Dependências sem vulnerabilidades conhecidas | ✅ | `npm audit` → 0 |
| Tipos | ✅ | `npx tsc --noEmit` |
| Lint sem erros | ✅ | `npm run lint` (2 avisos de `<img>`, aceitos) |
| Testes unitários | ✅ | `npm test` → 16/16 |
| Build de produção sem avisos | ✅ | `npm run build` |
| Segredos fora do bundle público | ✅ | Só o token **Storefront** (público por design) aparece em `.next/static` |
| `.env` fora do Git | ✅ | `.gitignore` cobre `.env*`; nunca commitado |
| Chave da CJ exposta no histórico público | ❌ | Rotacionar (`OWNER_ACTIONS.md` 1.1) |
| Correções desta auditoria commitadas | ⏳ | `git status` limpo |

## 2. Hospedagem (Vercel)

- **Build:** `npm run build`
- **Start:** `npm start` (a Vercel gerencia sozinha)
- **Node:** 20 ou superior (testado com 22.14)

| Variável | Onde é usada | Obrigatória | Estado |
|---|---|---|---|
| `SHOPIFY_STORE_DOMAIN` | `/api/checkout`, `/api/newsletter` (servidor) | Sim | ⏳ conferir na Vercel |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | idem (servidor) | Sim | ⏳ |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | catálogo (servidor e navegador) | Sim | ⏳ |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` | catálogo (servidor e navegador); token Storefront público | Sim | ⏳ |
| `NEXT_PUBLIC_SITE_URL` | canonical, Open Graph, sitemap, robots (ex.: `https://www.seudominio.com.br`) | Recomendada; sem ela usa o domínio `*.vercel.app` | ⏳ |
| `NEXT_PUBLIC_STORE_PASSWORD`, `CJ_*`, `PRODUCTS_JSON`, `DETAILS_JSON` | não usadas pelo site | **Não cadastrar** | — |

| Item | Estado |
|---|---|
| Domínio próprio apontado para a Vercel, com HTTPS (automático na Vercel) | ⏳ |
| Speed Insights ativado no projeto da Vercel (o script só existe lá) | ❔ |

## 3. Shopify

| Item | Estado | Observação |
|---|---|---|
| Loja sem senha (vitrine e checkout acessíveis) | ✅ | `/password` redireciona para a home |
| Opção de frete para o Brasil | ✅ | "Padrão" R$ 22,00 (CEP de SP) |
| Prazo estimado na opção de frete | ⏳ | `OWNER_ACTIONS.md` 3.3 |
| Meios de pagamento ativos | ✅ (visual) | Cartão com parcelas, PayPal, Pix (Appmax) |
| Pagamento aprovado em pedido real | ❔ | Roteiro na seção 5 |
| Português publicado (checkout em pt-BR) | ❌ | Hoje abre em `/en-br` |
| Políticas de Reembolso, Envio e Termos cadastradas | ❌ | Só existe Privacy (modelo em inglês) |
| Nome "Touge" na conta do cliente | ❌ | Hoje aparece "Shopcase" |
| E-mail remetente das notificações = e-mail oficial | ❔ | |
| Vitrine da Shopify redireciona ou é ocultada | ⏳ | `OWNER_ACTIONS.md` 3.6 |

## 4. Conteúdo e jurídico

| Item | Estado |
|---|---|
| Razão social, CNPJ/CPF e endereço no rodapé | ⏳ |
| Canais de contato reais (e-mail, WhatsApp, horário) | ⏳ |
| Política de Privacidade final publicada (site + Shopify) | ⏳ rascunho em `docs/legal/` |
| Termos e Condições finais publicados | ⏳ rascunho |
| Trocas, Devoluções e Reembolsos finais publicados | ⏳ rascunho; o site já cita os prazos do CDC |
| Envio e Entrega final publicado | ⏳ rascunho |
| Decisão sobre cookies e consentimento | ⏳ |
| Nenhum prazo, meio de pagamento ou contato fictício no site | ✅ |

## 5. Pedido de teste (antes de divulgar)

1. Na Shopify, confirme qual gateway processa o cartão e se ele tem modo de teste. Se não houver, faça um pedido real de baixo valor e estorne depois.
2. Em uma janela anônima no domínio de produção:
   1. Abra um produto.
   2. Escolha cor e tamanho.
   3. Adicione ao carrinho.
   4. Adicione outro tamanho.
3. No carrinho, confira os tamanhos, as quantidades e o total. Clique em **Finalizar compra**.
4. No checkout, confira:
   - idioma português;
   - os mesmos itens e tamanhos do carrinho;
   - frete com prazo;
   - links das políticas no rodapé.
5. Pague com Pix (mais simples de estornar) ou cartão.
6. Confira:
   - a página de confirmação;
   - o e-mail de confirmação (remetente, idioma, dados da loja);
   - o pedido no admin da Shopify;
   - o envio ao fornecedor, se for dropshipping;
   - o e-mail de envio com rastreio, quando houver.
7. Volte ao site. O carrinho ainda terá os itens (limitação conhecida P2-09); limpe-o manualmente.
8. Cancele e estorne o pedido. Confira se o reembolso chega e em quanto tempo, para validar o prazo da política.

## 6. Depois de cada deploy

1. Abrir `/`, `/products`, um produto, `/Cart`: nenhum erro no console do navegador.
2. Adicionar 2 tamanhos ao carrinho e clicar em **Finalizar compra**: deve abrir `.../checkouts/...` com os itens certos.
3. Conferir `https://<domínio>/sitemap.xml` e `/robots.txt`: devem usar o domínio de produção, não `localhost` nem `vercel.app`.
4. Testar no celular: menu "Vestuário" abre por toque; o carrinho não tem rolagem lateral.
5. Mudar o preço de um produto na Shopify: em até cerca de 5 minutos o novo valor aparece na home e nas listagens. Na página do produto, aparece na hora.

## 7. Como reverter

- **Vercel:** em *Deployments*, abrir o deploy anterior, que estava funcionando, e escolher **Promote to Production** (ou **Instant Rollback**). Leva segundos e não exige novo build.
- **Código:** `git revert <commit>` e novo push. Evite `git reset --hard` em branch publicada.
- **Shopify:** mudanças de idioma, políticas e frete são independentes do site; desfaça pelo próprio admin.
