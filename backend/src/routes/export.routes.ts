import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as exportService from '../services/export.service';

const router = Router();

router.use(authMiddleware);

// GET /api/export/products
router.get('/products', async (_req: Request, res: Response) => {
  try {
    const csv = await exportService.exportProducts();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="produk.csv"');
    res.send(csv);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/export/transactions?from=&to=&category=
router.get('/transactions', async (req: Request, res: Response) => {
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  const category = req.query.category as string | undefined;

  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      res.status(400).json({ error: 'Format tanggal tidak valid' });
      return;
    }
    if (toDate < fromDate) {
      res.status(400).json({ error: 'Tanggal akhir tidak boleh lebih awal dari tanggal awal' });
      return;
    }
  }

  try {
    const csv = await exportService.exportTransactions(from, to, category);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transaksi.csv"');
    res.send(csv);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
