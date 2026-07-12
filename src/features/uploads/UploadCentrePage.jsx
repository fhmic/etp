import { useEffect, useState, Fragment } from 'react';
import { CloudUpload, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { SectionHeader } from '../../components/SectionHeader.jsx';
import { useTerms } from '../../context/TerminologyContext.jsx';
import { api } from '../../lib/api.js';

export function UploadCentrePage() {
  const terms = useTerms();
  const [uploads, setUploads] = useState([]);
  const [uploadType, setUploadType] = useState('loan_portfolio');
  const [file, setFile] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  function load() {
    api.get('/uploads').then(({ data }) => setUploads(data.uploads || []));
  }

  useEffect(load, []);

  async function submit(event) {
    event.preventDefault();
    if (!file) return;
    setUploading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('uploadType', uploadType);
      formData.append('file', file);
      const { data } = await api.post('/uploads', formData);
      setResult(data.upload);
      setFile(null);
    } finally {
      setUploading(false);
      load();
    }
  }

  async function downloadTemplate() {
    setDownloading(true);
    try {
      const { data } = await api.get(`/uploads/template/${uploadType}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${uploadType}_template.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="page">
      <SectionHeader title="Upload Centre" eyebrow="Excel and CSV imports with validation history" />
      <form className="panel upload-panel" onSubmit={submit}>
        <select value={uploadType} onChange={e => { setUploadType(e.target.value); setResult(null); }}>
          <option value="loan_portfolio">Loan Portfolio</option>
          <option value="borrowings">{terms.borrowings}</option>
          <option value="investments">Investments</option>
          <option value="cash_balances">Cash Balances</option>
          <option value="debtors">{terms.debtors}</option>
        </select>
        <input type="file" accept=".csv,.xlsx,.xls" onChange={e => setFile(e.target.files[0])} />
        <div className="actions">
          <button type="button" onClick={downloadTemplate} disabled={downloading}>
            <Download size={16} />{downloading ? 'Downloading...' : 'Download Template'}
          </button>
          <button className="primary compact" disabled={!file || uploading}>
            <CloudUpload size={16} />{uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>

      <article className="panel">
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          Step 1 - download the template for the selected type above, fill it in following the Instructions sheet, then upload the completed file.
        </p>
      </article>

      {result && (
        <article className={`alert ${result.processedRows > 0 ? '' : 'danger'}`}>
          {result.processedRows > 0
            ? `${result.processedRows} row(s) processed successfully${result.updatedCount > 0 ? ` (${result.updatedCount} updated, ${result.processedRows - result.updatedCount} new)` : ''}.`
            : 'No rows were imported.'}
          {result.errors?.length > 0 && ` ${result.errors.length} row(s) had errors - see Upload History below for details.`}
        </article>
      )}

      <article className="panel">
        <h3>Upload History</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th></th><th>Type</th><th>File</th><th>Status</th><th>Rows</th><th>Updated</th><th>Date</th></tr></thead>
            <tbody>
              {uploads.map(row => (
                <Fragment key={row._id}>
                  <tr>
                    <td>
                      {row.errors?.length > 0 && (
                        <button className="icon-button" onClick={() => setExpandedId(expandedId === row._id ? null : row._id)}>
                          {expandedId === row._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      )}
                    </td>
                    <td>{row.uploadType}</td>
                    <td>{row.fileName}</td>
                    <td>{row.status}</td>
                    <td>{row.processedRows}</td>
                    <td>{row.updatedCount || 0}</td>
                    <td>{new Date(row.createdAt).toLocaleString()}</td>
                  </tr>
                  {expandedId === row._id && row.errors?.length > 0 && (
                    <tr>
                      <td colSpan={7}>
                        <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--red)', fontSize: 12 }}>
                          {row.errors.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {!uploads.length && <tr><td colSpan={7}>No uploads yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
