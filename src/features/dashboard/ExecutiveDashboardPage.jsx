import { useEffect, useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { KpiCard } from '../../components/KpiCard.jsx';
import { SectionHeader } from '../../components/SectionHeader.jsx';
import { api } from '../../lib/api.js';
import { money } from '../../lib/format.js';

function pct(value) {
  return `${Number(value || 0).toFixed(2)}%`;
}

function signed(value) {
  const v = Number(value || 0);
  return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;
}

const N = value => (value ? money(value) : '\u2014');
const P = value => (value != null ? pct(value) : '\u2014');

export function ExecutiveDashboardPage() {
  const [kpis, setKpis] = useState(null);
  const [maturity, setMaturity] = useState(null);
  const [loadedAt, setLoadedAt] = useState(null);

  function load() {
    api.get('/dashboard/treasury-kpis').then(({ data }) => {
      setKpis(data.kpis);
      setMaturity(data.maturityProfile);
      setLoadedAt(new Date());
    });
  }

  useEffect(load, []);

  if (!kpis) {
    return (
      <div className="page">
        <SectionHeader title="Executive Dashboard" eyebrow="Treasury command centre" />
        <article className="panel">Loading...</article>
      </div>
    );
  }

  const spreadPositive = kpis.netInterestSpread >= 0;
  const evaPositive = kpis.economicValueAdded >= 0;
  const netAssetPositive = kpis.netAssetCover >= 0;

  return (
    <div className="page">
      <SectionHeader
        title="Executive Dashboard"
        eyebrow={loadedAt ? `As at ${loadedAt.toLocaleString()}` : ''}
        action={<button className="primary compact" onClick={load}><RefreshCcw size={16} />Refresh</button>}
      />

      <div className="kpi-grid auto">
        <KpiCard label="Total Deployable Assets" value={money(kpis.totalDeployableAssets)} sub="Loans + Inv + Cash" tone="green" />
        <KpiCard label="Risk Assets" value={money(kpis.riskAssets)} sub="Outstanding receivables" />
        <KpiCard label="Investment" value={money(kpis.totalInvestments)} sub="Investment value" />
        <KpiCard label="Cash & Bank" value={money(kpis.cashAndBank)} sub="Cash & equivalents" />
        <KpiCard label="Total Funding Base" value={money(kpis.totalFundingBase)} sub="Debt + Equity" tone="red" />
        <KpiCard label="Total Borrowings" value={money(kpis.totalBorrowings)} sub={`${kpis.borrowingFacilityCount} facilities`} />
        <KpiCard label="Equity & Reserves" value={money(kpis.equityAndReserves)} sub="Capital + Retained Earnings" />
      </div>

      <div className="kpi-grid auto">
        <KpiCard label="Net Asset Cover" value={money(kpis.netAssetCover)} sub="Assets - Liabilities" tone={netAssetPositive ? 'green' : 'red'} />
        <KpiCard label="WARA" value={pct(kpis.wara)} sub="Return on earning assets" tone="amber" />
        <KpiCard label="WACD" value={pct(kpis.wacd)} sub="Weighted avg cost of debt" />
        <KpiCard label="WACC" value={pct(kpis.wacc)} sub="Weighted avg cost of capital" tone="green" />
        <KpiCard label="Net Int. Spread" value={signed(kpis.netInterestSpread)} sub="WARA - WACD" tone={spreadPositive ? 'green' : 'red'} />
        <KpiCard label="Economic Value Added" value={signed(kpis.economicValueAdded)} sub="EVA: WARA - WACC" tone={evaPositive ? 'green' : 'red'} />
      </div>

      <div className="kpi-grid auto">
        <KpiCard label="Debt / Equity" value={`${kpis.debtToEquity.toFixed(2)}x`} sub="Financial leverage" tone="green" />
        <KpiCard label="Debt / Assets" value={pct(kpis.debtToAssets * 100)} sub="Debt / Deployable Assets" tone="amber" />
        <KpiCard label="Debtor Yield" value={pct(kpis.debtorYield)} sub="Avg implied rate on debtors" tone="amber" />
        <KpiCard label="Investment Yield" value={pct(kpis.investmentYield)} sub="Weighted avg investment return" tone="green" />
        <KpiCard label="Cost of Equity (Ke)" value={pct(kpis.costOfEquity)} sub="Required shareholder return" />
      </div>

      {maturity && (
        <article className="panel">
          <h3>Asset & Liability Maturity Profile - Cumulative Tenor Gap</h3>
          <div className="table-wrap">
            <table className="maturity-table">
              <thead>
                <tr>
                  <th>Tenor</th>
                  {maturity.tenorLabels.map(label => <th key={label}>{label}</th>)}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="section-row"><td colSpan={maturity.tenorLabels.length + 2}>Deployable Assets</td></tr>
                <tr>
                  <td>Risk Assets (Debtors)</td>
                  {maturity.riskAssetsBkts.map((v, i) => <td key={i}>{N(v)}</td>)}
                  <td>{N(maturity.riskAssetsTotal)}</td>
                </tr>
                <tr>
                  <td>Investments</td>
                  {maturity.investmentsBkts.map((v, i) => <td key={i}>{N(v)}</td>)}
                  <td>{N(maturity.investmentsTotal)}</td>
                </tr>
                <tr>
                  <td>Cash & Equivalents</td>
                  {maturity.cashBkts.map((v, i) => <td key={i}>{N(v)}</td>)}
                  <td>{N(maturity.cashTotal)}</td>
                </tr>
                <tr className="total-row">
                  <td>Total Deployable Assets</td>
                  {maturity.deployableAssetsBkts.map((v, i) => <td key={i}>{N(v)}</td>)}
                  <td>{N(maturity.deployableAssetsTotal)}</td>
                </tr>
                <tr className="section-row"><td colSpan={maturity.tenorLabels.length + 2}>Funding Base</td></tr>
                <tr>
                  <td>Borrowings</td>
                  {maturity.borrowingsBkts.map((v, i) => <td key={i}>{N(v)}</td>)}
                  <td>{N(maturity.borrowingsTotal)}</td>
                </tr>
                <tr className="total-row">
                  <td>Total Funding Base</td>
                  {maturity.fundingBaseBkts.map((v, i) => <td key={i}>{N(v)}</td>)}
                  <td>{N(maturity.fundingBaseTotal)}</td>
                </tr>
                <tr className="total-row">
                  <td>Cumulative Gap</td>
                  {maturity.cumulativeGapBkts.map((v, i) => <td key={i} style={{ color: v >= 0 ? 'var(--green)' : 'var(--red)' }}>{N(v)}</td>)}
                  <td style={{ color: maturity.cumulativeGapTotal >= 0 ? 'var(--green)' : 'var(--red)' }}>{N(maturity.cumulativeGapTotal)}</td>
                </tr>
                <tr className="section-row"><td colSpan={maturity.tenorLabels.length + 2}>Weighted Average Cost of Funds</td></tr>
                <tr>
                  <td>WARA (Assets) %</td>
                  {maturity.waraBkts.map((v, i) => <td key={i}>{P(v)}</td>)}
                  <td>{P(kpis.wara)}</td>
                </tr>
                <tr>
                  <td>WACD (Liabilities) %</td>
                  {maturity.wacdBkts.map((v, i) => <td key={i}>{P(v)}</td>)}
                  <td>{P(kpis.wacd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      )}
    </div>
  );
}
