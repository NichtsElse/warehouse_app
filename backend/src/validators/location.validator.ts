import { z } from 'zod';

export const locationSchema = z.object({
  code: z.string().min(1, 'Kode lokasi wajib diisi'),
  name: z.string().min(1, 'Nama lokasi wajib diisi'),
});
