import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { locationSchema } from '../validators/location.validator';
import * as locationService from '../services/location.service';

const router = Router();

router.use(authMiddleware);

// GET /api/locations
router.get('/', async (_req: Request, res: Response) => {
  try {
    const locations = await locationService.getAll();
    res.json(locations);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/locations
router.post('/', async (req: Request, res: Response) => {
  const result = locationSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message });
    return;
  }
  try {
    const location = await locationService.create(result.data.code, result.data.name);
    res.status(201).json(location);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/locations/:id
router.put('/:id', async (req: Request, res: Response) => {
  const result = locationSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message });
    return;
  }
  try {
    const location = await locationService.update(req.params.id, result.data.code, result.data.name);
    res.json(location);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/locations/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await locationService.remove(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
