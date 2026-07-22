import { test } from "node:test";
import assert from "node:assert/strict";
import { isoDateInTz, resolveTz } from "../lib/dates-client";

// The canonical couple-day invariant (see coupleTz/todayIso in lib/dates).
// The whole seal depends on both keepers filing today under the SAME day key.

test("the bug: device-tz bucketing splits the couple across two day keys", () => {
  // An instant that is still Oct 15 (late evening) in Denver but already
  // Oct 16 (late morning) in Bangkok — the everyday long-distance overlap.
  const instant = new Date("2026-10-16T04:30:00Z");
  assert.equal(isoDateInTz(instant, "America/Denver"), "2026-10-15");
  assert.equal(isoDateInTz(instant, "Asia/Bangkok"), "2026-10-16");
  // Bucketing on each device's tz → different keys → the seal never closes.
  assert.notEqual(
    isoDateInTz(instant, "America/Denver"),
    isoDateInTz(instant, "Asia/Bangkok"),
  );
});

test("the fix: one couple tz gives both keepers the same day key", () => {
  const instant = new Date("2026-10-16T04:30:00Z");
  const coupleTz = "America/Denver";
  // Whichever device requests it, the shared day is computed from the couple tz
  // alone (no per-device input), so the two halves always meet under one key.
  const matthewsDevice = isoDateInTz(instant, coupleTz);
  const kennedysDevice = isoDateInTz(instant, coupleTz);
  assert.equal(matthewsDevice, kennedysDevice);
  assert.equal(matthewsDevice, "2026-10-15");
});

test("isoDateInTz holds across the UTC-midnight boundary", () => {
  const instant = new Date("2026-12-31T23:30:00Z");
  assert.equal(isoDateInTz(instant, "Asia/Bangkok"), "2027-01-01");
  assert.equal(isoDateInTz(instant, "America/Denver"), "2026-12-31");
});

test("resolveTz falls back on missing or bogus zones, keeps valid ones", () => {
  assert.equal(resolveTz(undefined, "America/Denver"), "America/Denver");
  assert.equal(resolveTz("", "America/Denver"), "America/Denver");
  assert.equal(resolveTz("Not/AZone", "America/Denver"), "America/Denver");
  assert.equal(resolveTz("Asia/Bangkok", "America/Denver"), "Asia/Bangkok");
});
