
export const MAX_LINES = 50;
export const MAX_LINE_QUANTITY = 99;

const VARIANT_GID = "gid://shopify/ProductVariant/";

export interface CheckoutLine {
  merchandiseId: string;
  quantity: number;
}

export type ValidationResult =
  | { ok: true; lines: CheckoutLine[] }
  | { ok: false; error: string };

export function validateLineItems(lineItems: unknown): ValidationResult {
  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    return { ok: false, error: "Nenhum item fornecido" };
  }
  if (lineItems.length > MAX_LINES) {
    return { ok: false, error: "Carrinho com itens demais" };
  }

  const lines: CheckoutLine[] = [];
  for (const item of lineItems) {
    const id = (item as { id?: unknown })?.id;
    const quantity = (item as { quantity?: unknown })?.quantity;
    if (typeof id !== "string" || !(id.startsWith(VARIANT_GID) || /^\d+$/.test(id))) {
      return { ok: false, error: "Itens do carrinho inválidos" };
    }
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_LINE_QUANTITY) {
      return { ok: false, error: "Quantidade inválida no carrinho" };
    }
    lines.push({ merchandiseId: id.startsWith(VARIANT_GID) ? id : `${VARIANT_GID}${id}`, quantity });
  }
  return { ok: true, lines };
}

export function invalidLineIndexes(userErrors: { field?: string[] | null }[]): number[] {
  return userErrors
    .map((e) => (e.field?.[1] === "lines" ? Number(e.field[2]) : NaN))
    .filter((index) => Number.isInteger(index));
}
