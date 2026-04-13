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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product, ProductPayload, createProduct, updateProduct } from '@/services/products.service';
import { getCategories, Category } from '@/services/categories.service';
import { getLocations, Location } from '@/services/locations.service';

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  product?: Product;
}

const EMPTY: ProductPayload = {
  name: '',
  sku: '',
  category_id: '',
  location_id: null,
  unit: '',
  price: 0,
  min_stock: 0,
};

export function ProductForm({ open, onOpenChange, onSuccess, product }: ProductFormProps) {
  const [form, setForm] = useState<ProductPayload>(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        product
          ? {
              name: product.name,
              sku: product.sku,
              category_id: product.category_id,
              location_id: product.location_id,
              unit: product.unit,
              price: product.price,
              min_stock: product.min_stock,
            }
          : EMPTY
      );
      setError('');
      getCategories().then(setCategories).catch(() => {});
      getLocations().then(setLocations).catch(() => {});
    }
  }, [open, product]);

  function set(field: keyof ProductPayload, value: string | number | null) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (product) {
        await updateProduct(product.id, form);
      } else {
        await createProduct(form);
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Produk' : 'Tambah Produk'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Produk</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Masukkan nama produk"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={form.sku}
                onChange={(e) => set('sku', e.target.value)}
                placeholder="Kode SKU"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Satuan</Label>
              <Input
                id="unit"
                value={form.unit}
                onChange={(e) => set('unit', e.target.value)}
                placeholder="pcs, kg, dll"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select value={form.category_id} onValueChange={(v) => set('category_id', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Lokasi (opsional)</Label>
            <Select
              value={form.location_id ?? 'none'}
              onValueChange={(v) => set('location_id', v === 'none' ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih lokasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— Tidak ada —</SelectItem>
                {locations.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.code} — {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Harga</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) => set('price', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_stock">Stok Minimum</Label>
              <Input
                id="min_stock"
                type="number"
                min={0}
                step="1"
                value={form.min_stock}
                onChange={(e) => set('min_stock', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

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
