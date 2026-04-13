import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAll() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}

export async function create(name: string) {
  const existing = await prisma.category.findFirst({ where: { name } });
  if (existing) {
    throw new Error('Nama kategori sudah digunakan');
  }
  return prisma.category.create({ data: { name } });
}

export async function update(id: string, name: string) {
  const existing = await prisma.category.findFirst({
    where: { name, NOT: { id } },
  });
  if (existing) {
    throw new Error('Nama kategori sudah digunakan');
  }
  return prisma.category.update({ where: { id }, data: { name } });
}

export async function remove(id: string) {
  const count = await prisma.product.count({ where: { category_id: id } });
  if (count > 0) {
    throw new Error('Kategori masih memiliki produk');
  }
  return prisma.category.delete({ where: { id } });
}
