
import { useEffect, useState } from 'react';
import { SectionHeader } from '../../components/SectionHeader.jsx';
import { KpiCard } from '../../components/KpiCard.jsx';
import { api } from '../../lib/api.js';
import { money, percent } from '../../lib/format.js';

export function EquityPage() {
  const [equity, setEquity] = useState({ shareCapital: 0, retainedEarnings: 0, otherReserves: 0, costOfEquity: 20 });
  const [totalDebt, setTotalDebt] = useState(0);

  useEffect(() => {
    api.get('/treasury/equity').then(({ data }) => { if (data.equity) setEquity(data.equity); });
    api.get('/dashboard/summary').then(({ data }) => setTotalDebt(data?.summary?.totalBorrowings || 0));
  }, []);

  async function save(e) {
    e.preventDefault();
    const { data } = await api.post('/treasury/equity', equity);
    setEquity(data.equity);
  }

  const totalEquity = Number(equity.shareCapital || 0) + Number(equity.retainedEarnings || 0) + Number(equity.otherReserves || 0);
  const totalCapital = totalEquity + totalDebt;
  const debtToEquity = totalEquity > 0 ? totalDebt / totalEquity : 0;

  return (
    <div className="page">
      <SectionHeader title="Equity & Reserves" eyebrow="Capital structure and funding balance" />
      <div className="kpi-grid three">
        <KpiCard label="Total Equity & Reserves" value={money(totalEquity)} tone="green" />
        <KpiCard label="Total Funding Base" value={money(totalCapital)} sub="Debt + Equity" />
        <KpiCard label="Debt / Equity Ratio" value={`${debtToEquity.toFixed(2)}×`} tone={debtToEquity > 3 ? 'amber' : 'green'} />
      </div>
      <form className="panel form-grid" onSubmit={save}>
        <h3>Update Capital Structure</h3>
        <label>Share Capital (₦)<input type="number" value={equity.shareCapital} onChange={e => setEquity({ ...equity, shareCapital: e.target.value })} /></label>
        <label>Retained Earnings (₦)<input type="number" value={equity.retainedEarnings} onChange={e => setEquity({ ...equity, retainedEarnings: e.target.value })} /></label>
        <label>Other Reserves (₦)<input type="number" value={equity.otherReserves} onChange={e => setEquity({ ...equity, otherReserves: e.target.value })} /></label>
        <label>Cost of Equity — Ke (%)<input type="number" value={equity.costOfEquity} onChange={e => setEquity({ ...equity, costOfEquity: e.target.value })} /></label>
        <div className="form-actions"><button className="primary">Save Capital Data</button></div>
      </form>
    </div>
  );
}
