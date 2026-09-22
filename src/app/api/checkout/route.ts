import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { lineItems } = await req.json();

    if (!lineItems || !lineItems.length) {
      return NextResponse.json({ error: "Nenhum item fornecido" }, { status: 400 });
    }

    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!domain || !token) {
      console.error("Erro: SHOPIFY_STORE_DOMAIN ou SHOPIFY_STOREFRONT_ACCESS_TOKEN não configurados no .env");
      return NextResponse.json(
        { error: "Domínio ou token ausente nas variáveis de ambiente" },
        { status: 500 }
      );
    }


    const formattedLines = lineItems.map((item: { quantity: number; id: string }) => {
      const merchandiseId = item.id.startsWith("gid://shopify/ProductVariant/")
        ? item.id
        : `gid://shopify/ProductVariant/${item.id}`;

      return {
        quantity: item.quantity,
        merchandiseId,
      };
    });

    const response = await fetch(`https://${domain}/api/2025-01/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query: `
          mutation cartCreate($lines: [CartLineInput!]!) {
            cartCreate(input: { lines: $lines }) {
              cart {
                id
                checkoutUrl
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          lines: formattedLines,
        },
      }),
    });

    const data = await response.json();
    console.log("Shopify Cart Response:", JSON.stringify(data, null, 2));

    if (data.errors) {
      console.error("Erros do GraphQL da Shopify:", data.errors);
      return NextResponse.json({ error: data.errors }, { status: 400 });
    }


    const userErrors = data.data?.cartCreate?.userErrors;
    if (userErrors && userErrors.length > 0) {
      console.error("Erros de validação da Shopify:", userErrors);

      // "field" comes back as ["input", "lines", "<index>", "merchandiseId"]
      // for a bad line item — pull the index out so the client can drop
      // exactly that item from the cart instead of failing opaquely.
      const invalidLineIndexes = userErrors
        .map((e: { field?: string[] }) => {
          const index = e.field?.[1] === "lines" ? Number(e.field[2]) : NaN;
          return Number.isInteger(index) ? index : null;
        })
        .filter((index: number | null): index is number => index !== null);

      return NextResponse.json(
        {
          error: userErrors
            .map((e: { message: string }) => e.message)
            .join(" "),
          invalidLineIndexes,
        },
        { status: 400 }
      );
    }

    const checkoutUrl = data.data?.cartCreate?.cart?.checkoutUrl;

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: "Não foi possível gerar a URL de checkout." },
        { status: 500 }
      );
    }

    return NextResponse.json({ checkoutUrl });

  } catch (err) {
    console.error("Erro no manipulador do Cart Checkout:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor de checkout" },
      { status: 500 }
    );
  }
}