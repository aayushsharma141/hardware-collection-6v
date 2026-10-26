/**
 * Escapes text for an HTML body or attribute.
 *
 * Every lead field is typed by a website visitor, and both the staff email and
 * the Telegram alert are HTML. Unescaped, a name such as `<a href=...>` becomes
 * a live link in the staff inbox, and a stray `<` makes Telegram reject the
 * whole message.
 */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
