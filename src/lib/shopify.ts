interface Image {
  src: string;
  altText: string | null;
  width: number;
  height: number;
}

interface SelectedOption {
  name: string;
  value: string;
}

interface Variant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
}

interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  images: Image[];
  variants: Variant[];
  options: ProductOption[];
}

interface ProductEdge {
  node: {
    id: string;
    handle: string;
    title: string;
    descriptionHtml: string;
    images: {
      edges: { node: Image }[];
    };
    variants: {
      edges: { node: Variant }[];
    };
    options: ProductOption[];
  };
}

type ProductsSortKey =
  | "RELEVANCE"
  | "CREATED_AT"
  | "BEST_SELLING"
  | "PRICE"
  | "TITLE"
  | "ID"
  | "PRODUCT_TYPE"
  | "VENDOR"
  | "UPDATED_AT";

interface GetProductsOptions {
  sortKey?: ProductsSortKey;
  reverse?: boolean;
}

export async function getProducts(
  first: number = 50,
  { sortKey, reverse }: GetProductsOptions = {}
): Promise<Product[]> {
  try {
    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2026-04/graphql.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Storefront-Access-Token":
            process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
          {
            products(
              first: ${first}
              ${sortKey ? `sortKey: ${sortKey}` : ""}
              ${reverse ? `reverse: true` : ""}
            ) {
              edges {
                node {
                  id
                  handle
                  title
                  descriptionHtml
                  images(first: 5) {
                    edges {
                      node {
                        src
                        altText
                        width
                        height
                      }
                    }
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
                        price {
                          amount
                          currencyCode
                        }
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
            }
          }
          `,
        }),
      }
    );

    const json = await response.json();

    if (!json?.data?.products?.edges) {
      console.error("Shopify não retornou produtos:", json);
      return [];
    }

    const products: Product[] = json.data.products.edges.map(
      ({ node }: ProductEdge) => ({
        id: node.id,
        handle: node.handle,
        title: node.title,
        descriptionHtml: node.descriptionHtml || "",
        images: node.images.edges.map((img) => img.node),
        variants: node.variants.edges.map((v) => v.node),
        options: node.options,
      })
    );

    return products;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  products: Product[];
}

export async function getCollectionByHandle(
  handle: string,
  first: number = 50
): Promise<Collection | null> {
  try {
    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2026-04/graphql.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Storefront-Access-Token":
            process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
          query getCollection($handle: String!, $first: Int!) {
            collectionByHandle(handle: $handle) {
              id
              handle
              title
              products(first: $first) {
                edges {
                  node {
                    id
                    handle
                    title
                    descriptionHtml
                    images(first: 5) {
                      edges {
                        node {
                          src
                          altText
                          width
                          height
                        }
                      }
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
                          price {
                            amount
                            currencyCode
                          }
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
              }
            }
          }
          `,
          variables: { handle, first },
        }),
      }
    );

    const json = await response.json();
    const collection = json?.data?.collectionByHandle;

    if (!collection) {
      return null;
    }

    return {
      id: collection.id,
      handle: collection.handle,
      title: collection.title,
      products: collection.products.edges.map(
        ({ node }: ProductEdge) => ({
          id: node.id,
          handle: node.handle,
          title: node.title,
          descriptionHtml: node.descriptionHtml || "",
          images: node.images.edges.map((img) => img.node),
          variants: node.variants.edges.map((v) => v.node),
          options: node.options,
        })
      ),
    };
  } catch (error) {
    console.error("Erro ao buscar coleção:", error);
    return null;
  }
}