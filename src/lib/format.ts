/** Amounts are stored and charged in Sri Lankan rupees (backend stripe.currency=lkr). */
const lkr = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0,
});

export const formatCurrency = (amount: number | null | undefined): string => lkr.format(amount ?? 0);

export const formatNumber = (value: number | null | undefined): string =>
  new Intl.NumberFormat("en-US").format(value ?? 0);

export const formatDate = (value: string | null | undefined): string => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};
