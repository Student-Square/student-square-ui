/**
 * Run: node --test src/lib/relative-time.test.ts
 *
 * The repo has no test runner; node:test plus Node's built-in type stripping
 * covers these two pure functions without adding one.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { dayGroup, timeAgo } from "./relative-time.ts";

// Wed 13 Aug 2026, 09:00 local.
const now = new Date(2026, 7, 13, 9, 0, 0);
const at = (d: number, h: number, m = 0) =>
  new Date(2026, 7, d, h, m, 0).toISOString();

test("dayGroup buckets by calendar day, not a rolling 24h window", () => {
  assert.equal(dayGroup(at(13, 8, 59), now), "Today");
  assert.equal(dayGroup(at(13, 0, 0), now), "Today", "midnight today is Today");
  assert.equal(dayGroup(at(12, 23, 50), now), "Yesterday", "late last night is not Today");
  assert.equal(dayGroup(at(12, 0, 0), now), "Yesterday");
  assert.equal(dayGroup(at(11, 23, 59), now), "This week");
  assert.equal(dayGroup(at(6, 0, 0), now), "This week", "7 days back is the edge");
  assert.equal(dayGroup(at(5, 23, 59), now), "Earlier");
});

test("timeAgo steps through minutes, hours and days", () => {
  const t = now.getTime();
  const ago = (mins: number) => timeAgo(new Date(t - mins * 60000).toISOString(), t);
  assert.equal(ago(0), "Just now");
  assert.equal(ago(1), "1m");
  assert.equal(ago(59), "59m");
  assert.equal(ago(60), "1h");
  assert.equal(ago(1439), "23h");
  assert.equal(ago(1440), "1d");
  assert.equal(ago(10079), "6d");
  // Past a week it falls back to a locale date, not a "7d".
  assert.match(ago(10080), /\d/);
  assert.doesNotMatch(ago(10080), /^\d+d$/);
});
