import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StockByCategoryChart from '@/components/charts/StockByCategoryChart';
import TransactionTrendChart from '@/components/charts/TransactionTrendChart';
import {
  getSummary,
  getStockByCategory,
  getTransactionTrend,
  getLowStock,
  getRecentTransactions,
  DashboardSummary,
  StockByCategory,
  TransactionTrend,
  LowStockProduct,
  RecentTransaction,
} from '@/services/dashboard.service';

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

function SummaryCard({ title, value }: { title: string; value: string | number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [stockByCategory, setStockByCategory] = useState<StockByCategory[]>([]);
  const [trend, setTrend] = useState<TransactionTrend[]>([]);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [recentTx, setRecentTx] = useState<RecentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [s, sbc, t, ls, rt] = await Promise.all([
          getSummary(),
          getStockByCategory(),
          getTransactionTrend(),
          getLowStock(),
          getRecentTransactions(),
        ]);
        setSummary(s);
        setStockByCategory(sbc);
        setTrend(t);
        setLowStock(ls);
        setRecentTx(rt);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) {
    return <div className="p-6 text-muted-foreground">Memuat data dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard title="Total Produk" value={summary?.totalProducts ?? 0} />
        <SummaryCard title="Nilai Stok" value={formatRupiah(summary?.totalStockValue ?? 0)} />
        <SummaryCard title="Produk Stok Rendah" value={summary?.lowStockCount ?? 0} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stok per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <StockByCategoryChart data={stockByCategory} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tren Transaksi 30 Hari Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionTrendChart data={trend} />
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">5 Produk Stok Terendah</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 font-medium">Nama Produk</th>
                <th className="pb-2 font-medium">Kategori</th>
                <th className="pb-2 font-medium text-right">Stok</th>
                <th className="pb-2 font-medium text-right">Min. Stok</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-muted-foreground">
                    Tidak ada produk dengan stok rendah
                  </td>
                </tr>
              ) : (
                lowStock.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2">{p.name}</td>
                    <td className="py-2">{p.category.name}</td>
                    <td className="py-2 text-right text-red-500 font-medium">{p.stock}</td>
                    <td className="py-2 text-right">{p.min_stock}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Recent Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">10 Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 font-medium">Produk</th>
                <th className="pb-2 font-medium">Jenis</th>
                <th className="pb-2 font-medium text-right pr-6">Jumlah</th>
                <th className="pb-2 font-medium">Pengguna</th>
                <th className="pb-2 font-medium">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-muted-foreground">
                    Belum ada transaksi
                  </td>
                </tr>
              ) : (
                recentTx.map((tx) => (
                  <tr key={tx.id} className="border-b last:border-0">
                    <td className="py-2">{tx.product.name}</td>
                    <td className="py-2">
                      <Badge variant={tx.type === 'IN' ? 'default' : 'destructive'}>
                        {tx.type === 'IN' ? 'Masuk' : 'Keluar'}
                      </Badge>
                    </td>
                    <td className="py-2 text-right pr-6">{tx.quantity}</td>
                    <td className="py-2">{tx.user.name}</td>
                    <td className="py-2 text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
