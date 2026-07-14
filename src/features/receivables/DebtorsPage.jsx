import { useEffect, useState } from 'react';
import { Mail, Plus, Trash2 } from 'lucide-react';
import { SectionHeader } from '../../components/SectionHeader.jsx';
import { KpiCard } from '../../components/KpiCard.jsx';
import { api } from '../../lib/api.js';
import { money } from '../../lib/format.js';
import { useTerms } from '../../context/TerminologyContext.jsx';

export function DebtorsPage() {
  const terms = useTerms();
  const [debtors, setDebtors] = useState([]);
  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState({});
  const [formOpen, setFormOpen] = useState(false);

  function load() { api.get('/debtors').then(({ data }) => setDebtors(data.debtors || [])); setSelected([]); }
  useEffect(load, []);

  async function saveDebtor(e) {
    e.preventDefault();
    await api.post('/debtors', form);
    setForm({}); setFormOpen(false); load();
  }
  async function sendReminders() {
    if (!selected.length) return;
    await api.post('/email/send', { debtorIds: selected });
    setSelected([]); load();
  }
  async function deleteSelected() {
    if (!selected.length) return;
    if (!window.confirm(`Delete ${selected.length} selected ${terms.debtor.toLowerCase()}(s)? This cannot be undone.`)) return;
    try {
      await api.post('/debtors/bulk-delete', { ids: selected });
      load();
    } catch (err) {
      window.alert(err.response?.data?.message || 'Failed to delete selected records.');
    }
  }
  function toggleAll() {
    setSelected(selected.length === debtors.length ? [] : debtors.map(d => d._id));
  }

  const totalOutstanding = debtors.reduce((s, d) => s + (d.totalOutstanding || 0), 0);

  return (
    <div className="page">
      <SectionHeader title={terms.debtors} eyebrow="Ageing, exposure and payment reminders"
        action={<div className="actions">
          {selected.length > 0 && (
            <button className="danger" onClick={deleteSelected}><Trash2 size={16} />Delete Selected ({selected.length})</button>
          )}
          <button onClick={sendReminders} disabled={!selected.length}><Mail size={16} />Send Reminders ({selected.length})</button>
          <button className="primary compact" onClick={() => setFormOpen(true)}><Plus size={16} />New {terms.debtor}</button>
        </div>} />
      <div className="kpi-grid three">
        <KpiCard label={`Total ${terms.receivables}`} value={money(totalOutstanding)} tone="blue" />
        <KpiCard label={`Total ${terms.debtors}`} value={debtors.length} />
      </div>
      {formOpen && (
        <form className="panel form-grid" onSubmit={saveDebtor}>
          <label>Name<input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
          <label>Email<input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
          <label>Phone<input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} /></label>
          <div className="form-actions"><button type="button" onClick={() => setFormOpen(false)}>Cancel</button><button className="primary">Save</button></div>
        </form>
      )}
      <article className="panel">
        <div className="table-wrap">
          <table>
            <thead><tr><th><input type="checkbox" checked={debtors.length > 0 && selected.length === debtors.length} onChange={toggleAll} /></th><th>Name</th><th>Email</th><th>Outstanding</th><th>Current</th><th>1-30</th><th>31-60</th><th>61-90</th><th>90+</th></tr></thead>
            <tbody>
              {debtors.map(d => (
                <tr key={d._id}>
                  <td><input type="checkbox" checked={selected.includes(d._id)} onChange={e => setSelected(e.target.checked ? [...selected, d._id] : selected.filter(id => id !== d._id))} /></td>
                  <td>{d.name}</td><td>{d.email || '-'}</td><td>{money(d.totalOutstanding)}</td>
                  <td>{money(d.ageing?.current)}</td><td>{money(d.ageing?.days1_30)}</td><td>{money(d.ageing?.days31_60)}</td>
                  <td>{money(d.ageing?.days61_90)}</td><td>{money((d.ageing?.days91_180 || 0) + (d.ageing?.days180plus || 0))}</td>
                </tr>
              ))}
              {!debtors.length && <tr><td colSpan={9}>No {terms.debtors.toLowerCase()} yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
