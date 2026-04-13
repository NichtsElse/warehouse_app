import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const include = { category: true, location: true };

export async function getAll(search?: string, category?: string) {
  return prisma.product.findMany({
    where: {
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
      ...(category ? { category_id: category } : {}),
    },
    include,
    orderBy: { name: 'asc' },
  });
}

export async function getById(id: string) {
  return prisma.product.findUnique({ where: { id }, include });
}

export async function create(data: {
  name: string;
  sku: string;
  category_id: string;
  location_id?: string | null;
  unit: string;
  price: number;
  min_stock: number;
}) {
  const existing = await prisma.product.findFirst({ where: { sku: data.sku } });
  if (existing) {
    throw new Error('SKU sudah digunakan');
  }
  const product = await prisma.product.create({
    data: {
      name: data.name,
      sku: data.sku,
      category_id: data.category_id,
      location_id: data.location_id ?? null,
      unit: data.unit,
      price: data.price,
      min_stock: data.min_stock,
    },
    include,
  });
  return { ...product, price: Number(product.price) };
}

export async function update(
  id: string,
  data: {
    name: string;
    sku: string;
    category_id: string;
    location_id?: string | null;
    unit: string;
    price: number;
    min_stock: number;
  }
) {
  const existing = await prisma.product.findFirst({
    where: { sku: data.sku, NOT: { id } },
  });
  if (existing) {
    throw new Error('SKU sudah digunakan');
  }
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      sku: data.sku,
      category_id: data.category_id,
      location_id: data.location_id ?? null,
      unit: data.unit,
      price: data.price,
      min_stock: data.min_stock,
    },
    include,
  });
  return { ...product, price: Number(product.price) };
}

export async function remove(id: string) {
  const count = await prisma.transaction.count({ where: { product_id: id } });
  if (count > 0) {
    throw new Error('Produk masih memiliki transaksi');
  }
  return prisma.product.delete({ where: { id } });
}
