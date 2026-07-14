import { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCcw, Trash2 } from 'lucide-react';
import { SectionHeader } from '../../components/SectionHeader.jsx';
import { api } from '../../lib/api.js';
import { money } from '../../lib/format.js';
import { useTerms } from '../../context/TerminologyContext.jsx';
import { moduleConfig } from './moduleConfig.js';

export function DataModulePage({ module }) {
  const terms = useTerms();
  const config = useMemo(() => {
    const base = moduleConfig[module];
    if (module === 'loans') return { ...base, title: terms.receivables };
    if (module === 'borrowings') return { ...base, title: terms.borrowings };
    return base;
  }, [module, terms]);
  const [rows, setRows] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({});
  const [selected, setSelected] = useState([]);

  function load() {
    api.get(config.endpoint).then(({ data }) => setRows(data[config.collection] || []));
    setSelected([]);
  }

  useEffect(() => {
    load();
  }, [config.endpoint]);

  async function save(event) {
    event.preventDefault();
    await api.post(config.endpoint, form);
    setForm({});
    setFormOpen(false);
    load();
  }

  async function remove(id) {
    await api.delete(`${config.endpoint}/${id}`);
    load();
  }

  function toggleOne(id) {
    setSelected(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  }

  function toggleAll() {
    setSelected(selected.length === rows.length ? [] : rows.map(r => r._id));
  }

  async function deleteSelected() {
    if (!selected.length) return;
    if (!window.confirm(`Delete ${selected.length} selected record(s)? This cannot be undone.`)) return;
    try {
      await api.post(`${config.endpoint}/bulk-delete`, { ids: selected });
      load();
    } catch (err) {
      window.alert(err.response?.data?.message || 'Failed to delete selected records.');
    }
  }

  return (
    <div className="page">
      <SectionHeader
        title={config.title}
        eyebrow="Operations"
        action={<div className="actions">
          {selected.length > 0 && (
            <button className="danger" onClick={deleteSelected}><Trash2 size={16} />Delete Selected ({selected.length})</button>
          )}
          <button onClick={load}><RefreshCcw size={16} />Refresh</button>
          <button className="primary compact" onClick={() => setFormOpen(true)}><Plus size={16} />New</button>
        </div>}
      />
      {formOpen && (
        <form className="panel form-grid" onSubmit={save}>
          {config.fields.map(([name, label, type = 'text']) => (
            <label key={name}>{label}<input type={type} value={form[name] || ''} onChange={e => setForm({ ...form, [name]: e.target.value })} /></label>
          ))}
          <div className="form-actions"><button type="button" onClick={() => setFormOpen(false)}>Cancel</button><button className="primary">Save</button></div>
        </form>
      )}
      <article className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" checked={rows.length > 0 && selected.length === rows.length} onChange={toggleAll} /></th>
                {config.columns.map(col => <th key={col}>{col.replace(/([A-Z])/g, ' $1')}</th>)}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row._id}>
                  <td><input type="checkbox" checked={selected.includes(row._id)} onChange={() => toggleOne(row._id)} /></td>
                  {config.columns.map(col => <td key={col}>{formatCell(row[col], col)}</td>)}
                  <td><button className="icon-button danger" onClick={() => remove(row._id)}><Trash2 size={15} /></button></td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={config.columns.length + 2}>No records yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}

function formatCell(value, key) {
  if (['principal', 'outstanding', 'principalAmount', 'outstandingBalance', 'availableBalance', 'restrictedBalance'].includes(key)) return money(value);
  if (String(key).toLowerCase().includes('date') && value) return new Date(value).toLocaleDateString();
  return value || '-';
}
