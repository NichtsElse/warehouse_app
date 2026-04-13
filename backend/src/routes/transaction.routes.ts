import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { transactionSchema } from '../validators/transaction.validator';
import * as transactionService from '../services/transaction.service';

const router = Router();

router.use(authMiddleware);

// GET /api/transactions?product=&from=&to=
router.get('/', async (req: Request, res: Response) => {
  try {
    const product = req.query.product as string | undefined;
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    const transactions = await transactionService.getAll(product, from, to);
    res.json(transactions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/transactions/:productId
router.get('/:productId', async (req: Request, res: Response) => {
  try {
    const transactions = await transactionService.getByProduct(req.params.productId);
    res.json(transactions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/transactions
router.post('/', async (req: Request, res: Response) => {
  const result = transactionSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message });
    return;
  }
  try {
    const transaction = await transactionService.create(result.data, req.user!.id);
    res.status(201).json(transaction);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
