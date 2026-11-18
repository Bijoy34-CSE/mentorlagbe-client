// Tuition fees are shown in Bangladeshi Taka
export function formatFee(amount: number): string {
  return `৳${amount.toLocaleString("en-US")}`;
}

// Example: 18 Nov 2026
export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}