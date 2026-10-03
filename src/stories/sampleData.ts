// Sample data for docs and stories only (not part of the published package).
export type OrderStatus = "Paid" | "Pending" | "Shipped" | "Refunded" | "Failed";

export interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: OrderStatus;
  placedAt: Date;
}

const customers = [
  ["Northwind Traders", "ops@northwind.com"],
  ["Contoso Ltd", "finance@contoso.com"],
  ["Fabrikam", "billing@fabrikam.io"],
  ["Adventure Works", "orders@adventure-works.com"],
  ["Blue Yonder Airlines", "procurement@blueyonder.aero"],
  ["Tailspin Toys", "hello@tailspintoys.com"],
  ["Wide World Importers", "ap@wideworld.co"],
  ["Litware Inc", "accounts@litware.dev"],
  ["Proseware", "team@proseware.app"],
  ["Woodgrove Bank", "vendor@woodgrove.bank"],
  ["Lamna Healthcare", "supply@lamna.health"],
  ["Coho Winery", "orders@cohowinery.com"]
] as const;

const statuses: OrderStatus[] = ["Paid", "Pending", "Shipped", "Paid", "Refunded", "Paid", "Failed", "Shipped"];

export const orders: Order[] = Array.from({ length: 36 }, (_, i) => {
  const [customer, email] = customers[i % customers.length]!;
  return {
    id: `A-${1040 + i}`,
    customer,
    email,
    total: Math.round((((i * 7919) % 4800) + 40) * 100) / 100,
    status: statuses[i % statuses.length]!,
    placedAt: new Date(2026, 8, 30 - (i % 28), 9 + (i % 8))
  };
});

export const statusTone = {
  Paid: "success",
  Pending: "warning",
  Shipped: "info",
  Refunded: "neutral",
  Failed: "danger"
} as const;

export const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
