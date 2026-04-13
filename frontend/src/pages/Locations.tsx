import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { LocationForm } from '@/components/LocationForm';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { Location, getLocations, deleteLocation } from '@/services/locations.service';

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Location | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Location | null>(null);
  const [deleteError, setDeleteError] = useState('');

  async function fetchLocations() {
    try {
      const data = await getLocations();
      setLocations(data);
    } catch {
      // silently fail — auth interceptor handles 401
    }
  }

  useEffect(() => {
    fetchLocations();
  }, []);

  function openAdd() {
    setEditTarget(undefined);
    setFormOpen(true);
  }

  function openEdit(location: Location) {
    setEditTarget(location);
    setFormOpen(true);
  }

  function openDelete(location: Location) {
    setDeleteTarget(location);
    setDeleteError('');
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteLocation(deleteTarget.id);
      setDeleteTarget(null);
      fetchLocations();
    } catch (err: any) {
      setDeleteError(err.response?.data?.error ?? 'Terjadi kesalahan saat menghapus');
    }
  }

  const columns: ColumnDef<Location>[] = [
    { header: 'Kode', accessorKey: 'code' },
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
        <h1 className="text-2xl font-semibold">Lokasi</h1>
        <Button onClick={openAdd}>Tambah Lokasi</Button>
      </div>

      <DataTable columns={columns} data={locations} />

      <LocationForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={fetchLocations}
        location={editTarget}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        title="Hapus Lokasi"
        description={
          deleteError
            ? deleteError
            : `Apakah Anda yakin ingin menghapus lokasi "${deleteTarget?.name}"?`
        }
      />
    </div>
  );
}
