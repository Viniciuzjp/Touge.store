
export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 99;

export interface CartImage {
  src: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface CartItem {
  id: string;
  variantId: string;
  title: string;
  variantTitle?: string;
  image: CartImage;
  price: string;
  currencyCode: string;
  quantity: number;
}

export function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return MIN_QUANTITY;
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.trunc(quantity)));
}

export function addItem(cart: CartItem[], item: Omit<CartItem, "quantity">): CartItem[] {
  const existing = cart.find((i) => i.id === item.id);
  if (existing) {
    return cart.map((i) => (i.id === item.id ? { ...i, quantity: clampQuantity(i.quantity + 1) } : i));
  }
  return [...cart, { ...item, quantity: MIN_QUANTITY }];
}

export function setQuantity(cart: CartItem[], id: string, quantity: number): CartItem[] {
  return cart.map((i) => (i.id === id ? { ...i, quantity: clampQuantity(quantity) } : i));
}

export function decrement(cart: CartItem[], id: string): CartItem[] {
  return cart
    .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
    .filter((i) => i.quantity >= MIN_QUANTITY);
}

export function removeItem(cart: CartItem[], id: string): CartItem[] {
  return cart.filter((i) => i.id !== id);
}

export function cartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, i) => sum + Number(i.price ?? 0) * i.quantity, 0);
}

export function cartCount(cart: CartItem[]): number {
  return cart.reduce((sum, i) => sum + i.quantity, 0);
}

export function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (i) =>
          i &&
          typeof i.id === "string" &&
          typeof i.variantId === "string" &&
          typeof i.title === "string" &&
          !Number.isNaN(Number(i.price)),
      )
      .map((i) => ({ ...i, quantity: clampQuantity(Number(i.quantity)) }));
  } catch {
    return [];
  }
}
