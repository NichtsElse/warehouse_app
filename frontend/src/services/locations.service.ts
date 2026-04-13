import api from './api';

export interface Location {
  id: string;
  code: string;
  name: string;
  created_at: string;
}

export async function getLocations(): Promise<Location[]> {
  const res = await api.get('/locations');
  return res.data;
}

export async function createLocation(code: string, name: string): Promise<Location> {
  const res = await api.post('/locations', { code, name });
  return res.data;
}

export async function updateLocation(id: string, code: string, name: string): Promise<Location> {
  const res = await api.put(`/locations/${id}`, { code, name });
  return res.data;
}

export async function deleteLocation(id: string): Promise<void> {
  await api.delete(`/locations/${id}`);
}
