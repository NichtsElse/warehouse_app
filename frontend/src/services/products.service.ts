import api from './api';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category_id: string;
  location_id: string | null;
  unit: string;
  price: number;
  stock: number;
  min_stock: number;
  created_at: string;
  updated_at: string;
  category: { id: string; name: string };
  location: { id: string; code: string; name: string } | null;
}

export interface ProductPayload {
  name: string;
  sku: string;
  category_id: string;
  location_id?: string | null;
  unit: string;
  price: number;
  min_stock: number;
}

export async function getProducts(search?: string, category?: string): Promise<Product[]> {
  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (category) params.category = category;
  const res = await api.get('/products', { params });
  return res.data;
}

export async function getProduct(id: string): Promise<Product> {
  const res = await api.get(`/products/${id}`);
  return res.data;
}

export async function createProduct(data: ProductPayload): Promise<Product> {
  const res = await api.post('/products', data);
  return res.data;
}

export async function updateProduct(id: string, data: ProductPayload): Promise<Product> {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}
