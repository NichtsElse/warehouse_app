import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const include = {
  product: { select: { id: true, name: true, sku: true } },
  user: { select: { id: true, name: true } },
};

export async function getAll(product?: string, from?: string, to?: string) {
  return prisma.transaction.findMany({
    where: {
      ...(product ? { product_id: product } : {}),
      ...(from || to
        ? {
            created_at: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    },
    include,
    orderBy: { created_at: 'desc' },
  });
}

export async function getByProduct(productId: string) {
  return prisma.transaction.findMany({
    where: { product_id: productId },
    include,
    orderBy: { created_at: 'desc' },
  });
}

export async function create(
  data: { product_id: string; type: 'IN' | 'OUT'; quantity: number; note?: string },
  userId: string
) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: data.product_id } });
    if (!product) {
      throw new Error('Produk tidak ditemukan');
    }

    if (data.type === 'OUT' && product.stock < data.quantity) {
      throw new Error('Stok tidak mencukupi');
    }

    const transaction = await tx.transaction.create({
      data: {
        product_id: data.product_id,
        type: data.type,
        quantity: data.quantity,
        note: data.note,
        created_by: userId,
      },
      include,
    });

    await tx.product.update({
      where: { id: data.product_id },
      data: {
        stock: data.type === 'IN'
          ? { increment: data.quantity }
          : { decrement: data.quantity },
      },
    });

    return transaction;
  });
}
