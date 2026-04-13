import { z } from 'zod';

export const transactionSchema = z.object({
  product_id: z.string().uuid('Produk tidak valid'),
  type: z.enum(['IN', 'OUT'], { errorMap: () => ({ message: 'Jenis transaksi harus IN atau OUT' }) }),
  quantity: z.number().int().positive('Jumlah harus lebih dari 0'),
  note: z.string().optional(),
});
