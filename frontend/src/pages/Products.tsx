import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { ProductForm } from '@/components/ProductForm';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { Product, getProducts, deleteProduct } from '@/services/products.service';

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleteError, setDeleteError] = useState('');

  async function fetchProducts(q?: string) {
    try {
      const data = await getProducts(q || undefined);
      setProducts(data);
    } catch {
      // auth interceptor handles 401
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setSearch(val);
    fetchProducts(val);
  }

  function openAdd() {
    setEditTarget(undefined);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditTarget(product);
    setFormOpen(true);
  }

  function openDelete(product: Product) {
    setDeleteTarget(product);
    setDeleteError('');
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
      fetchProducts(search);
    } catch (err: any) {
      setDeleteError(err.response?.data?.error ?? 'Terjadi kesalahan saat menghapus');
    }
  }

  const columns: ColumnDef<Product>[] = [
    { header: 'Nama', accessorKey: 'name' },
    { header: 'SKU', accessorKey: 'sku' },
    {
      header: 'Kategori',
      cell: (row) => row.category?.name ?? '-',
    },
    {
      header: 'Lokasi',
      cell: (row) => (row.location ? `${row.location.code} — ${row.location.name}` : '-'),
    },
    {
      header: 'Stok',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.stock}</span>
          {row.stock < row.min_stock && (
            <Badge variant="destructive">Stok Rendah</Badge>
          )}
        </div>
      ),
    },
    {
      header: 'Harga',
      cell: (row) => formatRupiah(row.price),
    },
    {
      header: 'Aksi',
      cell: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => openDelete(row)}>
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Produk</h1>
        <Button onClick={openAdd}>Tambah Produk</Button>
      </div>

      <Input
        placeholder="Cari produk..."
        value={search}
        onChange={handleSearchChange}
        className="max-w-sm"
      />

      <DataTable columns={columns} data={products} />

      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={() => fetchProducts(search)}
        product={editTarget}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        title="Hapus Produk"
        description={
          deleteError
            ? deleteError
            : `Apakah Anda yakin ingin menghapus produk "${deleteTarget?.name}"?`
        }
      />
    </div>
  );
}
