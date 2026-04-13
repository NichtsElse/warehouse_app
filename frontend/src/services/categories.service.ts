import api from './api';

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export async function getCategories(): Promise<Category[]> {
  const res = await api.get('/categories');
  return res.data;
}

export async function createCategory(name: string): Promise<Category> {
  const res = await api.post('/categories', { name });
  return res.data;
}

export async function updateCategory(id: string, name: string): Promise<Category> {
  const res = await api.put(`/categories/${id}`, { name });
  return res.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`);
}
