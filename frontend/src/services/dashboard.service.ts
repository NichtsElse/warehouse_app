import api from './api';

export interface DashboardSummary {
  totalProducts: number;
  totalStockValue: number;
  lowStockCount: number;
}

export interface StockByCategory {
  category: string;
  stock: number;
}

export interface TransactionTrend {
  date: string;
  in: number;
  out: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  min_stock: number;
  category: { name: string };
  location: { name: string } | null;
}

export interface RecentTransaction {
  id: string;
  type: 'IN' | 'OUT';
  quantity: number;
  created_at: string;
  product: { name: string };
  user: { name: string };
}

export async function getSummary(): Promise<DashboardSummary> {
  const res = await api.get('/dashboard/summary');
  return res.data;
}

export async function getStockByCategory(): Promise<StockByCategory[]> {
  const res = await api.get('/dashboard/stock-by-category');
  return res.data;
}

export async function getTransactionTrend(): Promise<TransactionTrend[]> {
  const res = await api.get('/dashboard/transaction-trend');
  return res.data;
}

export async function getLowStock(): Promise<LowStockProduct[]> {
  const res = await api.get('/dashboard/low-stock');
  return res.data;
}

export async function getRecentTransactions(): Promise<RecentTransaction[]> {
  const res = await api.get('/dashboard/recent-transactions');
  return res.data;
}
