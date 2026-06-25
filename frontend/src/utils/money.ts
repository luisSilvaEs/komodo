/**
 * Formats an integer amount in cents to a localized currency display string.
 *
 * @param cents - The amount in cents (e.g. 229900)
 * @param currency - ISO 4217 currency code (e.g. "MXN", "USD")
 * @returns Formatted string (e.g. "$2,299.00 MXN")
 *
 * @example
 * formatMoney(229900, "MXN") // "$2,299.00 MXN"
 * formatMoney(1999, "USD")   // "$19.99 USD"  (if locale is en-US)
 */
export function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    currencyDisplay: "code",
  }).format(cents / 100);
}