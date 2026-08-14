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
