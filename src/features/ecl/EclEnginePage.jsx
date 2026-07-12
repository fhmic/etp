import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { KpiCard } from '../../components/KpiCard.jsx';
import { SectionHeader } from '../../components/SectionHeader.jsx';
import { api } from '../../lib/api.js';
import { money, percent } from '../../lib/format.js';

export function EclEnginePage() {
  const [result, setResult] = useState(null);
  const [models, setModels] = useState([]);

  useEffect(() => {
    api.get('/ecl/models').then(({ data }) => setModels(data.models || []));
  }, []);

  async function run() {
    const { data } = await api.post('/ecl/run', {
      name: 'IFRS 9 ECL Run',
      settings: { stage2Dpd: 31, stage3Dpd: 91 }
    });
    setResult(data);
    const modelsRes = await api.get('/ecl/models');
    setModels(modelsRes.data.models || []);
  }

  const summary = result?.summary || models[0]?.summary || {};
  const rows = result?.rows || models[0]?.rows || [];

  return (
    <div className="page">
      <SectionHeader title="IFRS 9 ECL Engine" eyebrow="PD x LGD x EAD with probability-weighted scenarios" action={<button className="primary compact" onClick={run}><Activity size={16} />Run ECL</button>} />
      <div className="kpi-grid three">
        <KpiCard label="Total Exposure" value={money(summary.totalEad)} />
        <KpiCard label="Probability Weighted ECL" value={money(summary.totalEcl)} tone="amber" />
        <KpiCard label="Coverage Ratio" value={percent(summary.coverageRatio)} tone="red" />
      </div>
      <article className="panel">
        <h3>Stage Migration Analysis</h3>
        <div className="stage-grid">
          {(summary.stageDistribution || []).map(stage => (
            <div className={`stage-card stage-${stage.stage}`} key={stage.stage}>
              <span>Stage {stage.stage}</span>
              <strong>{stage.count}</strong>
              <small>{money(stage.exposure)} exposure</small>
            </div>
          ))}
        </div>
      </article>
      <article className="panel">
        <h3>Computed ECL Results</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Loan ID</th><th>Customer</th><th>Stage</th><th>EAD</th><th>PD</th><th>LGD</th><th>Weighted ECL</th></tr></thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.loanId}>
                  <td>{row.loanId}</td><td>{row.customerName}</td><td>Stage {row.stage}</td><td>{money(row.ead)}</td><td>{percent(row.pd)}</td><td>{percent(row.lgd)}</td><td>{money(row.weightedEcl)}</td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan="7">Run ECL after loading portfolio records.</td></tr>}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
