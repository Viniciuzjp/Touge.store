import { NextResponse } from "next/server";

export async function GET(
  _req: Request, context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-07/graphql.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Storefront-Access-Token":
            process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query getProduct($id: ID!) {
              product(id: $id) {
                id
                handle
                title
                descriptionHtml
                images(first: 5) {
                  edges { node { src altText width height } }
                }
                options {
                  name
                  values
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      price { amount currencyCode }
                      availableForSale
                      selectedOptions {
                        name
                        value
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: { id },
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Erro Shopify:", text);
      return NextResponse.json(
        { error: "Erro ao buscar produto" },
        { status: response.status }
      );
    }

    const data = await response.json();
    if (!data?.data?.product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    const product = {
      ...data.data.product,
      images: data.data.product.images.edges.map(
        (e: {
          node: { src: string; altText: string; width: number; height: number };
        }) => e.node
      ),
      variants: data.data.product.variants.edges.map(
        (v: {
          node: {
            id: string;
            title: string;
            price: { amount: string; currencyCode: string };
            availableForSale: string;
            selectedOptions: { name: string; value: string }[];
          };
        }) => v.node
      ),

    };

    return NextResponse.json(product);
  } catch (err) {
    console.error("Erro ao buscar produto da Shopify:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
