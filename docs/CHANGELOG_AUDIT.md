# Registro de alterações da auditoria — 27/10/2026

Base: commit `3700818`. Alterações ainda **não commitadas**.

Validação comum a todas as mudanças:
- `npm audit` → 0 vulnerabilidades
- `npx tsc --noEmit` → sem erros
- `npm run lint` → 0 erros
- `npm test` → 16/16
- `npm run build` → sem avisos
- Testes de navegador (Chrome headless, desktop e celular) na seção 3.4 de `ECOMMERCE_AUDIT.md`

## Segurança e dependências

| Arquivo | Problema | Solução | Risco ou pendência |
|---|---|---|---|
| `package.json`, `package-lock.json` | `next@16.1.1` com falhas críticas de execução remota de código (P0-01) e outras 7 dependências vulneráveis | `npm audit fix` (Next 16.4.3, sharp, postcss etc., sem quebra de versão); mínimo `next@^16.4.3` | Nenhum observado; build e fluxo retestados |
| `next.config.ts` | `images.domains` obsoleto e liberando 5 hosts sem uso; sem headers de segurança; aviso de raiz do workspace | `remotePatterns` só com `cdn.shopify.com`; `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`; `turbopack.root` | Se no futuro usar imagens de outro host com `next/image`, adicione-o em `remotePatterns` |

## Ferramentas

| Arquivo | Problema | Solução |
|---|---|---|
| `package.json` (`lint`) | `next lint` foi removido no Next 16; o script falhava | `eslint .` |
| `eslint.config.mjs` | O ESLint analisava `.next/` (12.517 "problemas") | `ignores` para `.next`, `node_modules`, `next-env.d.ts` |
| `package.json` (`test`), `tests/*.test.mjs` | Nenhum teste automatizado | 16 testes com `node --test` (sem dependência nova): regras do carrinho e validação do checkout |

## Carrinho e checkout

| Arquivo | Problema | Solução | Teste |
|---|---|---|---|
| `src/lib/cart.ts` (novo) | Regras do carrinho dentro do componente, sem testes | Funções puras: adicionar, quantidade (1–99), remover, total, leitura segura do `localStorage` | `tests/cart.test.mjs` |
| `src/app/Cart/ui/CartContext/Context.tsx` | Quantidade negativa apagava o item; sem limite; carrinho regravado vazio durante o carregamento; abas se sobrescrevendo; erro em navegação privada | Usa `lib/cart`; grava só depois de ler; escuta o evento `storage`; `try/catch` | Navegador: −5/0/vazio → 1, 999999 → 99, recarregar, outra aba |
| `src/app/Cart/ui/products/product.tsx` | Campo de quantidade sem limite nem rótulo | `min`/`max` e `aria-label`; valor tratado no contexto | Navegador |
| `src/lib/checkout.ts` (novo) | Validação inline na rota | `validateLineItems` (ids de variante, quantidade 1–99, até 50 linhas) e `invalidLineIndexes` | `tests/checkout.test.mjs` |
| `src/app/api/checkout/route.ts` | Erro do GraphQL devolvido cru (alerta "[object Object]"); mensagens da Shopify em inglês para o cliente; corpo inválido → 500; sem checar o status HTTP | Mensagens em português; 400, 502 ou 500 conforme o caso; registra `warnings` da Shopify; `cache: "no-store"` | curl: válido, variante inexistente, corpo inválido; navegador até o checkout |
| `src/app/api/newsletter/route.ts` | Corpo não-JSON → 500 | → 400 "E-mail inválido" | curl |

## Produto, SEO e acessibilidade

| Arquivo | Problema | Solução | Teste |
|---|---|---|---|
| `src/components/text/Text.tsx`, `interface.ts` | Toda variante virava `<h1>` (60 na home) | `h1`–`h4` só nas variantes de título, `<p>` no resto, mais a prop `as` | 30 páginas com exatamente 1 `h1` |
| `src/app/page.tsx`, `src/app/Cart/page.tsx` | Sem `h1` | `h1` com `sr-only` | idem |
| `src/app/produtos/[id]/page.tsx` | Produto inexistente: "Erro ao buscar produto"; preço como `h2` | "Produto não encontrado" com link; falha temporária com mensagem própria; preço com `as="p"` | Navegador |
| `src/lib/shopify.ts` | Consulta de produto duplicada na rota | `getProductById` (null = não existe; exceção = Shopify indisponível) | API e navegador |
| `src/app/api/products/[id]/route.ts` | Consulta duplicada; 404 e falha misturados | Usa `getProductById`; 404 ou 502 | curl |
| `src/app/produtos/[id]/layout.tsx` (novo) | Produto sem título, descrição, Open Graph ou dados estruturados | Metadados e JSON-LD `Product` com dados reais | Navegador: título, canonical, JSON-LD com 10 ofertas |
| `src/lib/site.ts` (novo), `src/app/layout.tsx` | Sem URL base nem Open Graph do site | `SITE_URL` (`NEXT_PUBLIC_SITE_URL` ou domínio da Vercel), `metadataBase`, Open Graph pt_BR | Pendente: definir a variável em produção |
| `src/app/sitemap.ts`, `src/app/robots.ts` (novos) | Ausentes | Sitemap com páginas e produtos; robots bloqueia `/api/` e `/Cart` | 200; 26 URLs |
| `src/app/products/layout.tsx`, `src/app/Cart/layout.tsx` (novos) | Título genérico "Touge" | Títulos próprios; carrinho com `noindex` | Navegador |
| `src/components/dropdown/Dropdown.tsx`, `Modal.tsx` | Menu só abria com o mouse; 400 px fixos estouravam no celular | Botão com `aria-expanded`, abre por toque e teclado; largura fluida no celular | Navegador 390 px |
| `src/ui/Header/Header.tsx` | Link oculto para `/wishlist` (404); ícones de conta sem rótulo | Link removido; `aria-label` em "Minha conta" e "Meus pedidos" | Varredura de links |

## Conteúdo comercial

| Arquivo | Problema | Solução | Pendência |
|---|---|---|---|
| `src/app/Cart/ui/Shipping/shipping.tsx` | "5–7 Dias Úteis" sem fonte | "Prazo informado no checkout" | Prazo real (`OWNER_ACTIONS.md` 3.3) |
| `src/app/contact/page.tsx` | WhatsApp fictício `(11) 90000-0000` | Removido | E-mail e horário a confirmar |
| `src/app/faq/page.tsx` | Citava boleto (inexistente) e "5 a 7 dias" | Meios vistos no checkout (cartão com parcelamento, Pix, PayPal); prazo calculado no checkout | |
| `src/app/shipping/page.tsx` | "Despacho em até 2 dias úteis" e "5 a 7 dias" sem fonte | Texto sem prazos inventados | Política final em `docs/legal/` |
| `src/app/returns/page.tsx` | Defeito "em até 30 dias" (abaixo do CDC para bens duráveis) | Remete aos prazos do CDC (90 dias para duráveis) | Política final em `docs/legal/` |
| `src/ui/Footer/Footer.tsx` | Erros de digitação ("Apresentendo", "Compania", "Politicas") | Corrigidos | "WebTouge Inc." a confirmar |
| `src/design-system/layout/ProductCard.tsx`, `Conclude/conclude.tsx` | Imports sem uso | Removidos | |

## Documentação (nova)

- `docs/ECOMMERCE_AUDIT.md`
- `docs/PRODUCTION_CHECKLIST.md`
- `docs/OWNER_ACTIONS.md`
- este arquivo
- `docs/legal/*`: rascunhos com campos `[PREENCHER]`, que não devem ser publicados antes de preenchidos e revisados
