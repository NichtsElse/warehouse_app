import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { categorySchema } from '../validators/category.validator';
import * as categoryService from '../services/category.service';

const router = Router();

router.use(authMiddleware);

// GET /api/categories
router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAll();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/categories
router.post('/', async (req: Request, res: Response) => {
  const result = categorySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message });
    return;
  }
  try {
    const category = await categoryService.create(result.data.name);
    res.status(201).json(category);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/categories/:id
router.put('/:id', async (req: Request, res: Response) => {
  const result = categorySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message });
    return;
  }
  try {
    const category = await categoryService.update(req.params.id, result.data.name);
    res.json(category);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await categoryService.remove(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
