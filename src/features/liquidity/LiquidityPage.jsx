import { useEffect, useState } from 'react';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SectionHeader } from '../../components/SectionHeader.jsx';
import { api } from '../../lib/api.js';
import { money } from '../../lib/format.js';

export function LiquidityPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/liquidity/forecast').then(({ data }) => setData(data));
  }, []);

  const rows = data?.base || [];

  return (
    <div className="page">
      <SectionHeader title="Liquidity Management" eyebrow="30/60/90-day forecast and stress testing" />
      <article className="panel">
        <h3>Liquidity Forecast</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="horizonDays" tickFormatter={value => `${value}d`} />
            <YAxis tickFormatter={v => `${Math.round(v / 1000000)}m`} />
            <Tooltip formatter={value => money(value)} />
            <Line dataKey="netLiquidityPosition" stroke="#2563eb" strokeWidth={3} />
            <Line dataKey="netFlow" stroke="#059669" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </article>
      <div className="chart-grid">
        {['slowdown10', 'slowdown20', 'slowdown30'].map(key => (
          <article className="panel" key={key}>
            <h3>{key.replace('slowdown', '')}% Collection Slowdown</h3>
            {(data?.[key] || []).map(row => <p className="metric-row" key={row.horizonDays}><span>{row.horizonDays} days</span><strong>{money(row.netLiquidityPosition)}</strong></p>)}
          </article>
        ))}
      </div>
    </div>
  );
}
