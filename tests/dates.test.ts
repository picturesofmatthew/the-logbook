import { test } from "node:test";
import assert from "node:assert/strict";
import {
  clampRolloverHour,
  coupleDayFor,
  DEFAULT_ROLLOVER_HOUR,
  isoDateInTz,
  resolveTz,
} from "../lib/dates-client";

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

// ── the PATIENT day: the shared clock turns at a grace hour, not midnight ──

test("the patient day: the small hours still belong to yesterday", () => {
  const tz = "America/Denver";
  // 00:30 in Denver on the 16th — a keeper logging after a late evening.
  const oneAm = new Date("2026-10-16T06:30:00Z");
  assert.equal(isoDateInTz(oneAm, tz), "2026-10-16"); // the calendar has turned
  assert.equal(coupleDayFor(oneAm, tz), "2026-10-15"); // the couple-day has not

  // 05:00 Denver — past the 4am grace, the new day has begun.
  const fiveAm = new Date("2026-10-16T11:00:00Z");
  assert.equal(coupleDayFor(fiveAm, tz), "2026-10-16");

  // and the evening before is unmistakably its own day
  const evening = new Date("2026-10-16T02:00:00Z"); // 20:00 the 15th, Denver
  assert.equal(coupleDayFor(evening, tz), "2026-10-15");
});

test("the patient day never breaks the one-key invariant", () => {
  // Both keepers' requests bucket from the couple tz + the same grace hour, so
  // whoever asks, whenever they ask, the two halves land under one key.
  const instant = new Date("2026-10-16T06:30:00Z");
  const couple = "America/Denver";
  assert.equal(coupleDayFor(instant, couple), coupleDayFor(instant, couple));
  // A keeper physically in Bangkok changes nothing — the zone is the couple's.
  assert.notEqual(coupleDayFor(instant, couple), coupleDayFor(instant, "Asia/Bangkok"));
});

test("rollover 0 is the old strict-midnight behaviour", () => {
  const tz = "America/Denver";
  const oneAm = new Date("2026-10-16T06:30:00Z");
  assert.equal(coupleDayFor(oneAm, tz, 0), isoDateInTz(oneAm, tz));
});

test("the grace hour is clamped to a sane window", () => {
  assert.equal(clampRolloverHour(undefined), DEFAULT_ROLLOVER_HOUR);
  assert.equal(clampRolloverHour(Number.NaN), DEFAULT_ROLLOVER_HOUR);
  assert.equal(clampRolloverHour(0), 0);
  assert.equal(clampRolloverHour(3.7), 3);
  assert.equal(clampRolloverHour(-5), 0); // never rolls into yesterday's evening
  assert.equal(clampRolloverHour(20), 8); // never swallows a real morning
});

test("resolveTz falls back on missing or bogus zones, keeps valid ones", () => {
  assert.equal(resolveTz(undefined, "America/Denver"), "America/Denver");
  assert.equal(resolveTz("", "America/Denver"), "America/Denver");
  assert.equal(resolveTz("Not/AZone", "America/Denver"), "America/Denver");
  assert.equal(resolveTz("Asia/Bangkok", "America/Denver"), "Asia/Bangkok");
});
