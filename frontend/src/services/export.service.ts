import api from './api';

export async function exportProducts(): Promise<Blob> {
  const res = await api.get('/export/products', { responseType: 'blob' });
  return res.data;
}

export async function exportTransactions(
  from?: string,
  to?: string,
  category?: string
): Promise<Blob> {
  const params: Record<string, string> = {};
  if (from) params.from = from;
  if (to) params.to = to;
  if (category) params.category = category;

  const res = await api.get('/export/transactions', { responseType: 'blob', params });
  return res.data;
}
