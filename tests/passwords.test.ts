import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../lib/passwords";

test("passwords: a hash verifies its own password and rejects others", async () => {
  const hash = await hashPassword("correct horse battery staple");
  assert.ok(hash.includes(":"), "stored form is salt:key");
  assert.equal(
    await verifyPassword("correct horse battery staple", hash),
    true,
  );
  assert.equal(await verifyPassword("wrong password", hash), false);
});

test("passwords: the same password hashes differently each time (random salt)", async () => {
  const a = await hashPassword("same");
  const b = await hashPassword("same");
  assert.notEqual(a, b);
  // …yet each still verifies.
  assert.equal(await verifyPassword("same", a), true);
  assert.equal(await verifyPassword("same", b), true);
});

test("passwords: a malformed stored hash rejects safely, never throws", async () => {
  assert.equal(await verifyPassword("anything", "not-a-valid-hash"), false);
  assert.equal(await verifyPassword("anything", ""), false);
  assert.equal(await verifyPassword("anything", "onlysalt:"), false);
});
