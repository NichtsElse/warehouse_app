import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Location, createLocation, updateLocation } from '@/services/locations.service';

interface LocationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  location?: Location;
}

export function LocationForm({ open, onOpenChange, onSuccess, location }: LocationFormProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setCode(location?.code ?? '');
      setName(location?.name ?? '');
      setError('');
    }
  }, [open, location]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) {
      setError('Kode lokasi wajib diisi');
      return;
    }
    if (!name.trim()) {
      setError('Nama lokasi wajib diisi');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (location) {
        await updateLocation(location.id, code.trim(), name.trim());
      } else {
        await createLocation(code.trim(), name.trim());
      }
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{location ? 'Edit Lokasi' : 'Tambah Lokasi'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Kode Lokasi</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Contoh: A-01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lokasi</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lokasi"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
