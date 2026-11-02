import { test } from "node:test";
import assert from "node:assert/strict";
import { validateLineItems, invalidLineIndexes, MAX_LINES } from "../src/lib/checkout.ts";

const GID = "gid://shopify/ProductVariant/45914272202861";

test("aceita linhas válidas e normaliza ids numéricos para gid", () => {
  const r = validateLineItems([{ id: GID, quantity: 2 }, { id: "123", quantity: 1 }]);
  assert.equal(r.ok, true);
  assert.deepEqual(r.lines, [
    { merchandiseId: GID, quantity: 2 },
    { merchandiseId: "gid://shopify/ProductVariant/123", quantity: 1 },
  ]);
});

test("rejeita payloads malformados com erro de validação (400), não exceção", () => {
  for (const bad of [undefined, null, "x", {}, [], [{ id: GID }], [{ id: 5, quantity: 1 }]]) {
    assert.equal(validateLineItems(bad).ok, false, JSON.stringify(bad));
  }
});

test("rejeita quantidades inválidas", () => {
  for (const quantity of [0, -1, 1.5, 100, "2", NaN]) {
    assert.equal(validateLineItems([{ id: GID, quantity }]).ok, false, String(quantity));
  }
});

test("rejeita ids que não são de variante", () => {
  assert.equal(validateLineItems([{ id: "gid://shopify/Product/1", quantity: 1 }]).ok, false);
  assert.equal(validateLineItems([{ id: "abc", quantity: 1 }]).ok, false);
});

test("limita o número de linhas", () => {
  const many = Array.from({ length: MAX_LINES + 1 }, (_, i) => ({ id: String(i + 1), quantity: 1 }));
  assert.equal(validateLineItems(many).ok, false);
});

test("extrai os índices das linhas rejeitadas pela Shopify", () => {
  const errors = [
    { field: ["input", "lines", "1", "merchandiseId"], message: "x" },
    { field: ["input", "buyerIdentity"], message: "y" },
    { field: null, message: "z" },
  ];
  assert.deepEqual(invalidLineIndexes(errors), [1]);
});
