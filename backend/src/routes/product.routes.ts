import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { productSchema } from '../validators/product.validator';
import * as productService from '../services/product.service';

const router = Router();

router.use(authMiddleware);

// GET /api/products?search=&category=
router.get('/', async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const products = await productService.getAll(search, category);
    res.json(products.map((p) => ({ ...p, price: Number(p.price) })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await productService.getById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Produk tidak ditemukan' });
      return;
    }
    res.json({ ...product, price: Number(product.price) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products
router.post('/', async (req: Request, res: Response) => {
  const result = productSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message });
    return;
  }
  try {
    const product = await productService.create(result.data);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/products/:id
router.put('/:id', async (req: Request, res: Response) => {
  const result = productSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message });
    return;
  }
  try {
    const product = await productService.update(req.params.id, result.data);
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await productService.remove(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
