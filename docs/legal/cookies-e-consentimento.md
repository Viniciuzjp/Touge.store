# Cookies e consentimento — orientação

Documento interno para decisão do proprietário. Não é texto para publicar.

## O que existe hoje (verificado no código)

| Ferramenta | Onde | Usa cookies? | Essencial? |
|---|---|---|---|
| Carrinho | `localStorage` do navegador | Não (armazenamento local, sem dados pessoais) | Sim |
| Checkout e contas da Shopify | Domínio da Shopify | Sim, cookies da Shopify | Sim, para comprar |
| Google Analytics 4 (`G-N8P0DYJMMB`) | `src/app/layout.tsx`, carregado para todos os visitantes | Sim (`_ga`, `_ga_*`) | **Não** |
| Vercel Speed Insights | `src/app/layout.tsx` | Não, segundo a Vercel; coleta métricas de desempenho sem identificar o visitante | Não, mas de baixo impacto |

Não há pixels de anúncio (Meta, TikTok, Google Ads) no site. [PREENCHER: confirmar se há pixels instalados no admin da Shopify, que valem para o checkout.]

## O que a lei e a ANPD indicam

- O Guia Orientativo de Cookies da ANPD (2022) recomenda consentimento para cookies não essenciais, como os de estatística e publicidade, e permite justificar alguns usos por legítimo interesse, desde que documentados e com opção de recusa.
- Uma simples faixa "este site usa cookies", sem permitir recusar, **não** demonstra consentimento.

## Opções (escolha uma)

1. **Aviso com aceite e recusa + Google Consent Mode (recomendada).**
   - O GA carrega em modo "negado" e só grava cookies se o visitante aceitar.
   - Implementação pequena: um componente de faixa no `layout.tsx` e uma chamada `gtag('consent', 'update', ...)`, sem plataforma paga.
   - Efeito: o Analytics passa a contar só quem aceitar (parte dos dados é estimada pelo Google).
2. **Legítimo interesse, com aviso e link para recusar.**
   - Mantém o GA como está e acrescenta um aviso com explicação e opção de desativar.
   - Exige registrar a avaliação de legítimo interesse.
   - Risco jurídico maior que a opção 1.
3. **Remover o Google Analytics.**
   - Fica só o Speed Insights e as estatísticas do próprio admin da Shopify.
   - Elimina a necessidade de consentimento para estatísticas.

Depois de decidir, atualize a seção 7 da Política de Privacidade.
