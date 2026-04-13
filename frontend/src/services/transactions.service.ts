import api from './api';

export interface Transaction {
  id: string;
  product_id: string;
  type: 'IN' | 'OUT';
  quantity: number;
  note: string | null;
  created_by: string;
  created_at: string;
  product: { id: string; name: string; sku: string };
  user: { id: string; name: string };
}

export interface TransactionPayload {
  product_id: string;
  type: 'IN' | 'OUT';
  quantity: number;
  note?: string;
}

export async function getTransactions(product?: string, from?: string, to?: string): Promise<Transaction[]> {
  const params: Record<string, string> = {};
  if (product) params.product = product;
  if (from) params.from = from;
  if (to) params.to = to;
  const res = await api.get('/transactions', { params });
  return res.data;
}

export async function getProductTransactions(productId: string): Promise<Transaction[]> {
  const res = await api.get(`/transactions/${productId}`);
  return res.data;
}

export async function createTransaction(data: TransactionPayload): Promise<Transaction> {
  const res = await api.post('/transactions', data);
  return res.data;
}
