import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { exportProducts, exportTransactions } from '../services/export.service';
import { getCategories, type Category } from '../services/categories.service';
import { useToast } from '../hooks/use-toast';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);

  // Transaction filter state
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [category, setCategory] = useState('');
  const [dateError, setDateError] = useState('');

  // Loading states
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  async function handleExportProducts() {
    setLoadingProducts(true);
    try {
      const blob = await exportProducts();
      downloadBlob(blob, 'produk.csv');
    } catch {
      toast({ title: 'Gagal mengekspor produk', variant: 'destructive' });
    } finally {
      setLoadingProducts(false);
    }
  }

  async function handleExportTransactions() {
    setDateError('');

    if (from && to && new Date(to) < new Date(from)) {
      setDateError('Tanggal akhir tidak boleh lebih awal dari tanggal awal');
      return;
    }

    setLoadingTransactions(true);
    try {
      const blob = await exportTransactions(
        from || undefined,
        to || undefined,
        category || undefined
      );
      downloadBlob(blob, 'transaksi.csv');
    } catch {
      toast({ title: 'Gagal mengekspor transaksi', variant: 'destructive' });
    } finally {
      setLoadingTransactions(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Laporan &amp; Ekspor</h1>

      {/* Ekspor Produk */}
      <Card>
        <CardHeader>
          <CardTitle>Ekspor Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Unduh semua data produk beserta kategori, lokasi, stok, dan harga dalam format CSV.
          </p>
          <Button onClick={handleExportProducts} disabled={loadingProducts}>
            {loadingProducts ? 'Mengunduh...' : 'Unduh CSV Produk'}
          </Button>
        </CardContent>
      </Card>

      {/* Ekspor Transaksi */}
      <Card>
        <CardHeader>
          <CardTitle>Ekspor Transaksi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Filter transaksi berdasarkan rentang tanggal dan/atau kategori, lalu unduh sebagai CSV.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* From date */}
            <div className="space-y-1">
              <Label htmlFor="from">Dari Tanggal</Label>
              <Input
                id="from"
                type="date"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setDateError('');
                }}
              />
            </div>

            {/* To date */}
            <div className="space-y-1">
              <Label htmlFor="to">Sampai Tanggal</Label>
              <Input
                id="to"
                type="date"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setDateError('');
                }}
              />
            </div>

            {/* Category filter */}
            <div className="space-y-1">
              <Label>Kategori</Label>
              <Select value={category || 'all'} onValueChange={(v) => setCategory(v === 'all' ? '' : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua kategori</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {dateError && (
            <p className="text-sm text-destructive">{dateError}</p>
          )}

          <Button onClick={handleExportTransactions} disabled={loadingTransactions}>
            {loadingTransactions ? 'Mengunduh...' : 'Unduh CSV Transaksi'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
