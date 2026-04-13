import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { CategoryForm } from '@/components/CategoryForm';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { Category, getCategories, deleteCategory } from '@/services/categories.service';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleteError, setDeleteError] = useState('');

  async function fetchCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      // silently fail — auth interceptor handles 401
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function openAdd() {
    setEditTarget(undefined);
    setFormOpen(true);
  }

  function openEdit(category: Category) {
    setEditTarget(category);
    setFormOpen(true);
  }

  function openDelete(category: Category) {
    setDeleteTarget(category);
    setDeleteError('');
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      fetchCategories();
    } catch (err: any) {
      setDeleteError(err.response?.data?.error ?? 'Terjadi kesalahan saat menghapus');
    }
  }

  const columns: ColumnDef<Category>[] = [
    { header: 'Nama', accessorKey: 'name' },
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
        <h1 className="text-2xl font-semibold">Kategori</h1>
        <Button onClick={openAdd}>Tambah Kategori</Button>
      </div>

      <DataTable columns={columns} data={categories} />

      <CategoryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={fetchCategories}
        category={editTarget}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        title="Hapus Kategori"
        description={
          deleteError
            ? deleteError
            : `Apakah Anda yakin ingin menghapus kategori "${deleteTarget?.name}"?`
        }
      />
    </div>
  );
}
