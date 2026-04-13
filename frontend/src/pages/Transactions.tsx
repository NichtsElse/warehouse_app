import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { TransactionForm } from '@/components/TransactionForm';
import { Transaction, getTransactions } from '@/services/transactions.service';

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formOpen, setFormOpen] = useState(false);

  async function fetchTransactions() {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch {
      // auth interceptor handles 401
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const columns: ColumnDef<Transaction>[] = [
    {
      header: 'Produk',
      cell: (row) => row.product.name,
    },
    {
      header: 'Jenis',
      cell: (row) =>
        row.type === 'IN' ? (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Masuk</Badge>
        ) : (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Keluar</Badge>
        ),
    },
    { header: 'Jumlah', accessorKey: 'quantity' },
    {
      header: 'Keterangan',
      cell: (row) => row.note ?? '-',
    },
    {
      header: 'Dicatat oleh',
      cell: (row) => row.user.name,
    },
    {
      header: 'Tanggal',
      cell: (row) => formatDate(row.created_at),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Transaksi</h1>
        <Button onClick={() => setFormOpen(true)}>Catat Transaksi</Button>
      </div>

      <DataTable columns={columns} data={transactions} />

      <TransactionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={fetchTransactions}
      />
    </div>
  );
}
