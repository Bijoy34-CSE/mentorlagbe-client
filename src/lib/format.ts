// Tuition fees are shown in Bangladeshi Taka
export function formatFee(amount: number): string {
  return `৳${amount.toLocaleString("en-US")}`;
}