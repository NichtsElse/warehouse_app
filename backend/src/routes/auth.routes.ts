import { Router, Request, Response } from 'express';
import { loginSchema } from '../validators/auth.validator';
import { login } from '../services/auth.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message });
    return;
  }

  try {
    const { email, password } = result.data;
    const data = await login(email, password);
    res.status(200).json(data);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Logout berhasil' });
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req: Request, res: Response) => {
  res.status(200).json({ user: req.user });
});

export default router;
