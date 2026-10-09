<div align="center">

<img src="public/images/logo.png" alt="Touge" width="320" />

### Camisetas oversized para quem vive a cultura automotiva.

Loja headless construída em **Next.js 16** sobre a **Shopify Storefront API** — o catálogo, carrinho e checkout rodam na Shopify, a experiência de compra é 100% customizada.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Shopify](https://img.shields.io/badge/Shopify-Storefront_API-7AB55C?logo=shopify&logoColor=white)](https://shopify.dev/docs/api/storefront)

[Demo](https://web-shopcase-p6b6-git-main-viniciuzjps-projects.vercel.app?_vercel_share=bU8DuVAerAwDTGYgUB12ZMYzP7hk8o6O) · [Reportar um bug](https://github.com/Viniciuzjp/WebShopcase/issues)

</div>

---

## Índice

- [Sobre](#sobre)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Começando](#começando)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Checklist no admin da Shopify](#checklist-no-admin-da-shopify)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Scripts](#scripts)
- [Deploy](#deploy)
- [Limitações conhecidas](#limitações-conhecidas)

## Sobre

**Touge** é uma loja de streetwear automotivo (JDM, supercarros, F1) construída como front-end headless: o Next.js cuida de toda a experiência de navegação, carrinho e UI, enquanto a Shopify continua sendo a fonte de verdade para produtos, estoque, clientes e pagamento. O checkout final acontece no checkout hospedado da própria Shopify.

**Principais funcionalidades**

- Catálogo de produtos consumido via **Shopify Storefront API** (GraphQL)
- PDP com seletor de variantes dinâmico (lê as opções reais do produto na Shopify — cor, tamanho, o que existir)
- Carrinho persistido em `localStorage`, com recuperação automática de itens que não existem mais na Shopify (produto removido/loja migrada)
- Checkout via `cartCreate` da Storefront API, com redirecionamento para o checkout hospedado da Shopify
- Páginas de categoria dinâmicas (`/categories/[handle]`) mapeadas para Coleções da Shopify
- Cadastro de newsletter via `customerCreate`
- Login/pedidos/perfil delegados ao Customer Accounts novo da Shopify

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI | React 19, TypeScript, Tailwind CSS 4 |
| E-commerce | Shopify Storefront API (GraphQL) |
| Animação / Carrossel | Framer Motion, Embla Carousel, Swiper |
| Ícones | Lucide |
| Analytics | Google Analytics 4, Vercel Speed Insights |
| Deploy | Vercel |

## Arquitetura

```
Navegador  ──►  Next.js (App Router)  ──►  Shopify Storefront API (GraphQL)
                       │
                       ├─ Server Components  → busca de produtos/coleções (SSR)
                       ├─ Route Handlers      → /api/checkout, /api/newsletter, /api/products/[id]
                       └─ Client Components   → carrinho (localStorage), UI interativa

Finalizar compra  ──►  checkout hospedado da Shopify (tougeclub.myshopify.com)
```

O front-end nunca lida com dados de pagamento diretamente — o fluxo de `cartCreate` gera uma `checkoutUrl` da própria Shopify, para onde o usuário é redirecionado.

## Começando

### Pré-requisitos

- Node.js 20+
- Uma loja Shopify com a [Storefront API](https://shopify.dev/docs/api/storefront) habilitada

### Instalação

```bash
git clone https://github.com/Viniciuzjp/WebShopcase.git
cd WebShopcase/shopcase
npm install
cp .env.example .env   # preencha com as credenciais da sua loja
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

Veja [`.env.example`](.env.example) para a lista completa. As obrigatórias:

| Variável | Onde é usada | Descrição |
| --- | --- | --- |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | Client + Server | Domínio `.myshopify.com` da loja |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` | Client | Token público da Storefront API (listagem/PDP) |
| `SHOPIFY_STORE_DOMAIN` | Server | Mesmo domínio, usado nas Route Handlers |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Server | Token da Storefront API usado em `/api/checkout` e `/api/newsletter` |

> **Atenção:** o token de servidor é um token de **Storefront API**, não de Admin API — tokens de Admin API têm o prefixo `shpat_` e vão falhar com `UNAUTHORIZED` em qualquer chamada aqui.

## Checklist no admin da Shopify

Algumas funcionalidades do front dependem de configuração feita diretamente no Shopify Admin — não dá pra resolver só no código:

- [ ] **Desativar a proteção por senha da loja** (Configurações → Canais de venda → Loja virtual) antes de ir para produção — com ela ativa, o checkout redireciona para a tela de senha da Shopify
- [ ] Criar as **Coleções** usadas pelas páginas de categoria, com os handles: `automotivo`, `pilotos`, `filmes`
- [ ] Cadastrar **variantes reais** (ex: opção "Tamanho") nos produtos que devem ter seletor de tamanho na PDP — hoje a maioria dos produtos tem só uma variante
- [ ] Liberar o escopo `unauthenticated_write_customers` no app Headless, se quiser que o cadastro de newsletter funcione

## Estrutura do projeto

```
src/
├── app/                  # Rotas (App Router)
│   ├── api/              # Route Handlers: checkout, newsletter, products/[id]
│   ├── Cart/              # Página e lógica do carrinho (Context + localStorage)
│   ├── categories/[handle] # Páginas de categoria (Coleções da Shopify)
│   ├── produtos/[id]      # PDP
│   └── ...                # Páginas estáticas (sobre, termos, FAQ, etc.)
├── ui/
│   ├── Header/, Footer/   # Layout global
│   └── Main/              # Seções da home (Hero, Ofertas, Categorias, Lançamentos, VideoBanner...)
├── components/             # Componentes reutilizáveis (botão, dropdown, cards...)
├── design-system/          # Tokens de tipografia e layout
└── lib/
    ├── shopify.ts          # Client da Storefront API (produtos, coleções)
    └── currency.ts          # Formatação de preço
```

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Ambiente de desenvolvimento (Turbopack) |
| `npm run build` | Build de produção |
| `npm run start` | Sobe o build de produção |
| `npm run lint` | ESLint |

## Deploy

O deploy é feito na [Vercel](https://vercel.com), que detecta o Next.js automaticamente. Configure as mesmas variáveis de ambiente do `.env` nas *Environment Variables* do projeto na Vercel antes do primeiro deploy.

## Limitações conhecidas

- As categorias (`/categories/[handle]`) mostram uma mensagem de "sem produtos" até as Coleções correspondentes serem criadas na Shopify (ver [checklist](#checklist-no-admin-da-shopify))
- O seletor de variantes na PDP só aparece quando o produto tem mais de uma opção cadastrada na Shopify — a maioria do catálogo atual tem uma variante só
- Não há testes automatizados configurados no projeto ainda

---

<div align="center">

© 2026 Touge — feito com Next.js

</div>
