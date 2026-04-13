import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TransactionTrend } from '@/services/dashboard.service';

interface Props {
  data: TransactionTrend[];
}

export default function TransactionTrendChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="in" name="Masuk" stroke="#22c55e" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="out" name="Keluar" stroke="#ef4444" dot={false} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
