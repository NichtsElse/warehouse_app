import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes';
import categoryRouter from './routes/category.routes';
import locationRouter from './routes/location.routes';
import productRouter from './routes/product.routes';
import transactionRouter from './routes/transaction.routes';
import dashboardRouter from './routes/dashboard.routes';
import exportRouter from './routes/export.routes';
import { errorMiddleware } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/locations', locationRouter);
app.use('/api/products', productRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/export', exportRouter);

// Global error handler
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

export default app;
