import { test } from "node:test";
import assert from "node:assert/strict";
import { encrypt, decrypt, encryptOrNull, decryptOrNull } from "../lib/crypto";

// Test-only key (32 zero bytes). key() reads env at call time, so setting it
// here (before any test body runs) is enough.
process.env.ENCRYPTION_KEY = "0".repeat(64);

test("crypto: round-trips text through AES-GCM", () => {
  const secret = "Grandma's funeral casserole";
  const ct = encrypt(secret);
  assert.notEqual(ct, secret);
  assert.equal(decrypt(ct), secret);
});

test("crypto: each encryption differs (random IV) but both decrypt", () => {
  const a = encrypt("same");
  const b = encrypt("same");
  assert.notEqual(a, b);
  assert.equal(decrypt(a), "same");
  assert.equal(decrypt(b), "same");
});

test("crypto: malformed or tampered ciphertext returns null, never throws", () => {
  assert.equal(decrypt("garbage"), null);
  assert.equal(decrypt(""), null);
  // Flip a character in the auth tag → GCM verification must fail.
  const parts = encrypt("secret").split(".");
  parts[1] = (parts[1][0] === "A" ? "B" : "A") + parts[1].slice(1);
  assert.equal(decrypt(parts.join(".")), null);
});

test("crypto: nullable helpers pass null/empty straight through", () => {
  assert.equal(encryptOrNull(null), null);
  assert.equal(encryptOrNull(""), null);
  assert.equal(decryptOrNull(null), null);
  const ct = encryptOrNull("x");
  assert.ok(ct);
  assert.equal(decryptOrNull(ct), "x");
});
