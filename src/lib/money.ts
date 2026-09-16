/**
 * Money on the client — FR-13-009.
 *
 * The API sends amounts as fixed-scale **strings** because a JSON number is a
 * float64 and cannot hold a ledger exactly. The rule here follows from that:
 * these helpers format strings for display, and nothing in the UI does
 * arithmetic on an amount. If a total is needed, the server computes it.
 *
 * `Number(amount)` anywhere in a component is the bug this file exists to
 * prevent.
 */

/** Groups thousands and keeps two decimal places. Accepts what the API sends. */
export const formatMoney = (value: string | null | undefined, currency = "") => {
  if (value === null || value === undefined || value === "") return currency ? `${currency} —` : "—";

  const negative = value.startsWith("-");
  const [whole = "0", fraction = ""] = value.replace("-", "").split(".");
  const cents = (fraction + "00").slice(0, 2);
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const rendered = `${negative ? "−" : ""}${grouped}.${cents}`;

  return currency ? `${currency} ${rendered}` : rendered;
};

/** Trims trailing zeros from a quantity — "2.0000" reads better as "2". */
export const formatQuantity = (value: string | null | undefined) => {
  if (!value) return "0";
  return value.includes(".") ? value.replace(/\.?0+$/, "") : value;
};

/** True when an amount string is above zero, without converting it to a number. */
export const isPositive = (value: string | null | undefined) =>
  Boolean(value) && !value!.startsWith("-") && /[1-9]/.test(value!);

/**
 * Normalises a form field before it is sent.
 *
 * The input stays a string all the way to the API; this only trims and
 * defaults an empty box to "0" so the server's decimal validation passes.
 */
export const amountForApi = (value: string) => {
  const trimmed = value.trim();
  return trimmed === "" ? "0" : trimmed;
};

/* ------------------------------------------------------------------------ *
 * Exact decimal arithmetic, for previewing a form the user is still typing.
 *
 * This is the narrow exception to the rule above, and it does not weaken it:
 * the ban exists because float64 cannot hold a ledger, so these work on
 * scaled BigInts and never touch `Number`. What they must NOT be used for is
 * a stored figure — a balance, an invoice subtotal, a report total. Those are
 * still the server's to compute and this file's to merely format.
 * ------------------------------------------------------------------------ */

const ZERO = BigInt(0);
const ONE = BigInt(1);
const TEN = BigInt(10);
const TWO = BigInt(2);

/** 10^places as a bigint — `**` on bigint needs a newer target than ES6. */
const pow10 = (places: number): bigint => BigInt(`1${"0".repeat(places)}`);

/** "12.34" -> [1234n, 2]. Anything unparseable reads as zero. */
const toScaled = (value: string | null | undefined): [bigint, number] => {
  const trimmed = (value ?? "").trim();
  if (trimmed === "") return [ZERO, 0];

  const negative = trimmed.startsWith("-");
  const body = trimmed.replace(/^[+-]/, "");
  if (!/^\d*(\.\d*)?$/.test(body)) return [ZERO, 0];

  const [whole = "", fraction = ""] = body.split(".");
  const digits = `${whole}${fraction}` || "0";
  const magnitude = BigInt(digits);
  return [negative ? -magnitude : magnitude, fraction.length];
};

/** Scaled BigInt -> fixed-places string, half-up at the last place. */
const render = (value: bigint, scale: number, places = 2): string => {
  let scaled = value;
  let currentScale = scale;

  while (currentScale < places) {
    scaled *= TEN;
    currentScale += 1;
  }

  if (currentScale > places) {
    const factor = pow10(currentScale - places);
    const negative = scaled < ZERO;
    const magnitude = negative ? -scaled : scaled;
    const whole = magnitude / factor;
    const rounded = (magnitude % factor) * TWO >= factor ? whole + ONE : whole;
    scaled = negative ? -rounded : rounded;
  }

  const negative = scaled < ZERO;
  const digits = (negative ? -scaled : scaled).toString().padStart(places + 1, "0");
  const whole = digits.slice(0, digits.length - places);
  const fraction = places > 0 ? `.${digits.slice(digits.length - places)}` : "";
  return `${negative ? "-" : ""}${whole}${fraction}`;
};

/** Line value: quantity × unit cost. Exact — no rounding until display. */
export const multiplyAmount = (quantity: string, unitCost: string): string => {
  const [q, qScale] = toScaled(quantity);
  const [u, uScale] = toScaled(unitCost);
  return render(q * u, qScale + uScale);
};

/** Adds amount strings at their widest scale. */
export const sumAmounts = (values: (string | null | undefined)[]): string => {
  const parsed = values.map(toScaled);
  const scale = parsed.reduce((widest, [, s]) => Math.max(widest, s), 0);
  const total = parsed.reduce(
    (acc, [value, valueScale]) => acc + value * pow10(scale - valueScale),
    ZERO
  );
  return render(total, scale);
};

/** `a - b`, same rules as sumAmounts. */
export const subtractAmounts = (a: string, b: string): string => {
  const [value, scale] = toScaled(b);
  return sumAmounts([a, render(-value, scale, scale)]);
};
