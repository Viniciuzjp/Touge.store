import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addItem, setQuantity, decrement, removeItem, cartTotal, cartCount,
  clampQuantity, parseStoredCart, MAX_QUANTITY,
} from "../src/lib/cart.ts";

const line = (variant, price = "79.99", extra = {}) => ({
  id: `gid://shopify/ProductVariant/${variant}`,
  variantId: `gid://shopify/ProductVariant/${variant}`,
  title: "Camiseta",
  variantTitle: `white / ${variant}`,
  image: { src: "x", altText: null, width: 1, height: 1 },
  price,
  currencyCode: "BRL",
  ...extra,
});

test("variantes diferentes do mesmo produto ficam em linhas separadas", () => {
  let cart = addItem([], line("m"));
  cart = addItem(cart, line("l"));
  assert.equal(cart.length, 2);
  assert.deepEqual(cart.map((i) => i.variantTitle), ["white / m", "white / l"]);
});

test("adicionar a mesma variante soma a quantidade", () => {
  let cart = addItem([], line("m"));
  cart = addItem(cart, line("m"));
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 2);
});

test("quantidade digitada é limitada entre 1 e o máximo", () => {
  const cart = addItem([], line("m"));
  assert.equal(setQuantity(cart, cart[0].id, 0)[0].quantity, 1);
  assert.equal(setQuantity(cart, cart[0].id, -5)[0].quantity, 1);
  assert.equal(setQuantity(cart, cart[0].id, NaN)[0].quantity, 1);
  assert.equal(setQuantity(cart, cart[0].id, 999999)[0].quantity, MAX_QUANTITY);
  assert.equal(setQuantity(cart, cart[0].id, 3.7)[0].quantity, 3);
});

test("quantidade inválida não remove o item", () => {
  const cart = addItem([], line("m"));
  assert.equal(setQuantity(cart, cart[0].id, -5).length, 1);
});

test("botão − na quantidade 1 remove a linha", () => {
  const cart = addItem([], line("m"));
  assert.equal(decrement(cart, cart[0].id).length, 0);
});

test("adicionar além do máximo não ultrapassa o limite", () => {
  let cart = setQuantity(addItem([], line("m")), line("m").id, MAX_QUANTITY);
  cart = addItem(cart, line("m"));
  assert.equal(cart[0].quantity, MAX_QUANTITY);
});

test("remover tira só a linha escolhida", () => {
  const cart = addItem(addItem([], line("m")), line("l"));
  assert.deepEqual(removeItem(cart, line("m").id).map((i) => i.id), [line("l").id]);
});

test("total e contagem somam todas as linhas", () => {
  let cart = addItem(addItem([], line("m", "79.99")), line("m", "79.99"));
  cart = addItem(cart, line("l", "59.99"));
  assert.equal(cartCount(cart), 3);
  assert.equal(cartTotal(cart).toFixed(2), "219.97");
});

test("carrinho salvo corrompido ou malformado não quebra a página", () => {
  assert.deepEqual(parseStoredCart(null), []);
  assert.deepEqual(parseStoredCart("{not json"), []);
  assert.deepEqual(parseStoredCart('{"a":1}'), []);
  const parsed = parseStoredCart(JSON.stringify([line("m", "79.99", { quantity: 500 }), { id: 1 }, null]));
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].quantity, MAX_QUANTITY);
});

test("clampQuantity trata valores não numéricos", () => {
  assert.equal(clampQuantity(Infinity), 1);
  assert.equal(clampQuantity(5), 5);
});
