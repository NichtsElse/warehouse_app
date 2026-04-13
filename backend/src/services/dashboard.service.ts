import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getSummary() {
  const products = await prisma.product.findMany({
    select: { stock: true, price: true, min_stock: true },
  });

  const totalProducts = products.length;
  const totalStockValue = products.reduce(
    (sum, p) => sum + p.stock * Number(p.price),
    0
  );
  const lowStockCount = products.filter((p) => p.stock < p.min_stock).length;

  return { totalProducts, totalStockValue, lowStockCount };
}

export async function getStockByCategory() {
  const products = await prisma.product.findMany({
    select: { stock: true, category: { select: { name: true } } },
  });

  const map = new Map<string, number>();
  for (const p of products) {
    const cat = p.category.name;
    map.set(cat, (map.get(cat) ?? 0) + p.stock);
  }

  return Array.from(map.entries()).map(([category, stock]) => ({ category, stock }));
}

export async function getTransactionTrend() {
  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  const transactions = await prisma.transaction.findMany({
    where: { created_at: { gte: since } },
    select: { type: true, quantity: true, created_at: true },
  });

  // Build a map for the last 30 days
  const map = new Map<string, { in: number; out: number }>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    map.set(key, { in: 0, out: 0 });
  }

  for (const t of transactions) {
    const key = t.created_at.toISOString().slice(0, 10);
    const entry = map.get(key);
    if (entry) {
      if (t.type === 'IN') entry.in += t.quantity;
      else entry.out += t.quantity;
    }
  }

  return Array.from(map.entries()).map(([date, counts]) => ({
    date,
    in: counts.in,
    out: counts.out,
  }));
}

export async function getLowStock() {
  // Fetch products where stock < min_stock using raw comparison
  const products = await prisma.$queryRaw<
    Array<{ id: string; name: string; sku: string; stock: number; min_stock: number; category_name: string; location_name: string | null }>
  >`
    SELECT p.id, p.name, p.sku, p.stock, p.min_stock,
           c.name AS category_name, l.name AS location_name
    FROM products p
    JOIN categories c ON c.id = p.category_id
    LEFT JOIN locations l ON l.id = p.location_id
    WHERE p.stock < p.min_stock
    ORDER BY p.stock ASC
    LIMIT 5
  `;

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    stock: Number(p.stock),
    min_stock: Number(p.min_stock),
    category: { name: p.category_name },
    location: p.location_name ? { name: p.location_name } : null,
  }));
}

export async function getRecentTransactions() {
  return prisma.transaction.findMany({
    orderBy: { created_at: 'desc' },
    take: 10,
    include: {
      product: { select: { id: true, name: true } },
      user: { select: { id: true, name: true } },
    },
  });
}
