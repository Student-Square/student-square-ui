/** U+2028 / U+2029 end a line in older JavaScript engines. */
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

/**
 * Serialises JSON-LD for a `<script type="application/ld+json">` tag.
 *
 * JSON.stringify alone is not safe here: it leaves `<` untouched, so a string
 * containing `</script>` — a story name any member can submit — closes the tag
 * and whatever follows runs as HTML. Escaping `<`, `>` and `&` as unicode
 * escapes keeps the JSON identical to a parser and inert to the HTML
 * tokenizer; the two line separators are escaped for the same reason.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .split(LINE_SEPARATOR)
    .join("\\u2028")
    .split(PARAGRAPH_SEPARATOR)
    .join("\\u2029");
}
