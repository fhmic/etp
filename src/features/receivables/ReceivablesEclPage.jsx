import { useEffect, useState } from 'react';
import { Activity, Save } from 'lucide-react';
import { KpiCard } from '../../components/KpiCard.jsx';
import { SectionHeader } from '../../components/SectionHeader.jsx';
import { api } from '../../lib/api.js';
import { money, percent } from '../../lib/format.js';

const BUCKET_LABELS = [
  ['current', 'Current'], ['days1_30', '1-30 Days'], ['days31_60', '31-60 Days'],
  ['days61_90', '61-90 Days'], ['days91_180', '91-180 Days'], ['days181_270', '181-270 Days'],
  ['days271_365', '271-365 Days'], ['days365plus', '365+ Days']
];

export function ReceivablesEclPage() {
  const [settings, setSettings] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [saving, setSaving] = useState(false);

  function loadSettings() {
    api.get('/receivables/ecl/settings').then(({ data }) => setSettings(data.settings));
  }
  function runPortfolio() {
    api.get('/receivables/ecl/portfolio').then(({ data }) => setPortfolio(data));
  }

  useEffect(() => { loadSettings(); runPortfolio(); }, []);

  async function saveSettings(event) {
    event.preventDefault();
    setSaving(true);
    const { data } = await api.put('/receivables/ecl/settings', settings);
    setSettings(data.settings);
    setSaving(false);
    runPortfolio();
  }

  async function saveSnapshot() {
    await api.post('/receivables/ecl/snapshots', { label: `Snapshot ${new Date().toLocaleDateString()}` });
  }

  if (!settings) {
    return (
      <div className="page">
        <SectionHeader title="Receivables IFRS 9 ECL" eyebrow="Provision matrix, staging and scenario weighting" />
        <article className="panel">Loading...</article>
      </div>
    );
  }

  const summary = portfolio?.summary || {};

  return (
    <div className="page">
      <SectionHeader
        title="Receivables IFRS 9 ECL"
        eyebrow="Provision matrix, SICR staging and probability-weighted scenarios"
        action={<div className="actions">
          <button onClick={runPortfolio}><Activity size={16} />Run Portfolio</button>
          <button className="primary compact" onClick={saveSnapshot}><Save size={16} />Save Snapshot</button>
        </div>}
      />

      <div className="kpi-grid three">
        <KpiCard label="Total Exposure (EAD)" value={money(summary.totalExposure)} />
        <KpiCard label="Probability-Weighted ECL" value={money(summary.totalEcl)} tone="amber" />
        <KpiCard label="Coverage Ratio" value={percent(summary.coverageRatio)} tone="red" />
      </div>

      <article className="panel">
        <h3>Stage Distribution</h3>
        <div className="stage-grid">
          <div className="stage-card"><span>Stage 1</span><strong>{summary.stage1Count || 0}</strong></div>
          <div className="stage-card stage-2"><span>Stage 2</span><strong>{summary.stage2Count || 0}</strong></div>
          <div className="stage-card stage-3"><span>Stage 3</span><strong>{summary.stage3Count || 0}</strong></div>
        </div>
      </article>

      <form className="panel form-grid" onSubmit={saveSettings}>
        <h3>Staging & Model Settings</h3>
        <label>Stage 2 DPD Threshold<input type="number" value={settings.stage2Dpd} onChange={e => setSettings({ ...settings, stage2Dpd: Number(e.target.value) })} /></label>
        <label>Stage 3 DPD Threshold<input type="number" value={settings.stage3Dpd} onChange={e => setSettings({ ...settings, stage3Dpd: Number(e.target.value) })} /></label>
        <label>Default Discount Rate (EIR %)<input type="number" value={settings.defaultDiscount} onChange={e => setSettings({ ...settings, defaultDiscount: Number(e.target.value) })} /></label>
        <label>Inflation Rate (%)<input type="number" value={settings.inflationRate} onChange={e => setSettings({ ...settings, inflationRate: Number(e.target.value) })} /></label>
        <label>GDP Growth Rate (%)<input type="number" value={settings.gdpGrowthRate} onChange={e => setSettings({ ...settings, gdpGrowthRate: Number(e.target.value) })} /></label>

        <div className="segmented inline" style={{ gridColumn: '1 / -1' }}>
          <label><input type="checkbox" checked={settings.useMatrix} onChange={e => setSettings({ ...settings, useMatrix: e.target.checked })} />Use provision matrix</label>
          <label><input type="checkbox" checked={settings.simplifiedApproach} onChange={e => setSettings({ ...settings, simplifiedApproach: e.target.checked })} />Simplified approach (trade floor)</label>
          <label><input type="checkbox" checked={settings.includeUndrawn} onChange={e => setSettings({ ...settings, includeUndrawn: e.target.checked })} />Include undrawn in EAD</label>
        </div>

        <h3 style={{ gridColumn: '1 / -1' }}>Provision Matrix (ageing bucket rate %)</h3>
        {BUCKET_LABELS.map(([key, label]) => (
          <label key={key}>{label}
            <input type="number" step="0.1" value={settings.provisionMatrix[key]}
              onChange={e => setSettings({ ...settings, provisionMatrix: { ...settings.provisionMatrix, [key]: Number(e.target.value) } })} />
          </label>
        ))}

        <h3 style={{ gridColumn: '1 / -1' }}>Probability-Weighted Scenarios</h3>
        <label>Base Weight (%)<input type="number" value={settings.eclScenarios.baseWeight} onChange={e => setSettings({ ...settings, eclScenarios: { ...settings.eclScenarios, baseWeight: Number(e.target.value) } })} /></label>
        <label>Upside Weight (%)<input type="number" value={settings.eclScenarios.upsideWeight} onChange={e => setSettings({ ...settings, eclScenarios: { ...settings.eclScenarios, upsideWeight: Number(e.target.value) } })} /></label>
        <label>Downside Weight (%)<input type="number" value={settings.eclScenarios.downsideWeight} onChange={e => setSettings({ ...settings, eclScenarios: { ...settings.eclScenarios, downsideWeight: Number(e.target.value) } })} /></label>
        <label>Upside Inflation Adj.<input type="number" value={settings.eclScenarios.upsideInflAdj} onChange={e => setSettings({ ...settings, eclScenarios: { ...settings.eclScenarios, upsideInflAdj: Number(e.target.value) } })} /></label>
        <label>Upside GDP Adj.<input type="number" value={settings.eclScenarios.upsideGdpAdj} onChange={e => setSettings({ ...settings, eclScenarios: { ...settings.eclScenarios, upsideGdpAdj: Number(e.target.value) } })} /></label>
        <label>Downside Inflation Adj.<input type="number" value={settings.eclScenarios.downInflAdj} onChange={e => setSettings({ ...settings, eclScenarios: { ...settings.eclScenarios, downInflAdj: Number(e.target.value) } })} /></label>
        <label>Downside GDP Adj.<input type="number" value={settings.eclScenarios.downGdpAdj} onChange={e => setSettings({ ...settings, eclScenarios: { ...settings.eclScenarios, downGdpAdj: Number(e.target.value) } })} /></label>

        <div className="form-actions"><button className="primary" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button></div>
      </form>

      <article className="panel">
        <h3>Computed ECL by Invoice</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Debtor</th><th>Invoice</th><th>Stage</th><th>Age Bucket</th><th>EAD</th><th>PD</th><th>LGD</th><th>Weighted ECL</th></tr>
            </thead>
            <tbody>
              {(portfolio?.rows || []).map(row => (
                <tr key={row.invoiceId}>
                  <td>{row.debtorName}</td>
                  <td>{row.invoiceNumber}</td>
                  <td>Stage {row.stage}</td>
                  <td>{row.ageBucket}</td>
                  <td>{money(row.ead)}</td>
                  <td>{percent(row.pdUsed)}</td>
                  <td>{percent(row.lgd)}</td>
                  <td>{money(row.weightedEcl)}</td>
                </tr>
              ))}
              {!(portfolio?.rows || []).length && <tr><td colSpan="8">Run the portfolio after loading debtors and invoices.</td></tr>}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
