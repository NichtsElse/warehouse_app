import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = (err as any).status || 500;
  const message = err.message || 'Terjadi kesalahan pada server';
  res.status(status).json({ error: message });
}
