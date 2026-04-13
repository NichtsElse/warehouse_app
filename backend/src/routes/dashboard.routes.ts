import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as dashboardService from '../services/dashboard.service';

const router = Router();

router.use(authMiddleware);

// GET /api/dashboard/summary
router.get('/summary', async (_req: Request, res: Response) => {
  try {
    const data = await dashboardService.getSummary();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/stock-by-category
router.get('/stock-by-category', async (_req: Request, res: Response) => {
  try {
    const data = await dashboardService.getStockByCategory();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/transaction-trend
router.get('/transaction-trend', async (_req: Request, res: Response) => {
  try {
    const data = await dashboardService.getTransactionTrend();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/low-stock
router.get('/low-stock', async (_req: Request, res: Response) => {
  try {
    const data = await dashboardService.getLowStock();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/recent-transactions
router.get('/recent-transactions', async (_req: Request, res: Response) => {
  try {
    const data = await dashboardService.getRecentTransactions();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
