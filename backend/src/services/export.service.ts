import { PrismaClient } from '@prisma/client';
import { createObjectCsvStringifier } from 'csv-writer';

const prisma = new PrismaClient();

export async function exportProducts(): Promise<string> {
  const products = await prisma.product.findMany({
    include: { category: true, location: true },
    orderBy: { name: 'asc' },
  });

  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'name', title: 'Nama' },
      { id: 'sku', title: 'SKU' },
      { id: 'category', title: 'Kategori' },
      { id: 'location', title: 'Lokasi' },
      { id: 'unit', title: 'Satuan' },
      { id: 'price', title: 'Harga' },
      { id: 'stock', title: 'Stok' },
      { id: 'min_stock', title: 'Stok Minimum' },
    ],
  });

  const records = products.map((p) => ({
    name: p.name,
    sku: p.sku,
    category: p.category.name,
    location: p.location ? p.location.name : '',
    unit: p.unit,
    price: Number(p.price),
    stock: p.stock,
    min_stock: p.min_stock,
  }));

  return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
}

export async function exportTransactions(
  from?: string,
  to?: string,
  category?: string
): Promise<string> {
  const products = category
    ? await prisma.product.findMany({ where: { category_id: category }, select: { id: true } })
    : null;

  const productIds = products ? products.map((p) => p.id) : undefined;

  const transactions = await prisma.transaction.findMany({
    where: {
      ...(productIds ? { product_id: { in: productIds } } : {}),
      ...(from || to
        ? {
            created_at: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    },
    include: {
      product: { select: { name: true, sku: true } },
      user: { select: { name: true } },
    },
    orderBy: { created_at: 'desc' },
  });

  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'product', title: 'Produk' },
      { id: 'sku', title: 'SKU' },
      { id: 'type', title: 'Jenis' },
      { id: 'quantity', title: 'Jumlah' },
      { id: 'note', title: 'Keterangan' },
      { id: 'created_by', title: 'Dicatat Oleh' },
      { id: 'created_at', title: 'Tanggal' },
    ],
  });

  const records = transactions.map((t) => ({
    product: t.product.name,
    sku: t.product.sku,
    type: t.type === 'IN' ? 'Masuk' : 'Keluar',
    quantity: t.quantity,
    note: t.note ?? '',
    created_by: t.user.name,
    created_at: t.created_at.toISOString(),
  }));

  return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
}
