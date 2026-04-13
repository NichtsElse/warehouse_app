import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAll() {
  return prisma.location.findMany({ orderBy: { code: 'asc' } });
}

export async function create(code: string, name: string) {
  const existing = await prisma.location.findFirst({ where: { code } });
  if (existing) {
    throw new Error('Kode lokasi sudah digunakan');
  }
  return prisma.location.create({ data: { code, name } });
}

export async function update(id: string, code: string, name: string) {
  const existing = await prisma.location.findFirst({
    where: { code, NOT: { id } },
  });
  if (existing) {
    throw new Error('Kode lokasi sudah digunakan');
  }
  return prisma.location.update({ where: { id }, data: { code, name } });
}

export async function remove(id: string) {
  const count = await prisma.product.count({ where: { location_id: id } });
  if (count > 0) {
    throw new Error('Lokasi masih digunakan oleh produk');
  }
  return prisma.location.delete({ where: { id } });
}
