import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi'),
  sku: z.string().min(1, 'SKU wajib diisi'),
  category_id: z.string().uuid('Kategori tidak valid'),
  location_id: z.string().uuid().optional().nullable(),
  unit: z.string().min(1, 'Satuan wajib diisi'),
  price: z.number().positive('Harga harus lebih dari 0'),
  min_stock: z.number().int().min(0, 'Stok minimum tidak boleh negatif'),
});
