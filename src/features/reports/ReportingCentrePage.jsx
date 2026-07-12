import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { SectionHeader } from '../../components/SectionHeader.jsx';
import { useTerms } from '../../context/TerminologyContext.jsx';
import { api } from '../../lib/api.js';

export function ReportingCentrePage() {
  const terms = useTerms();
  const [reports, setReports] = useState([]);
  const [generating, setGenerating] = useState(null);

  useEffect(() => {
    api.get('/reports').then(({ data }) => setReports(data.reports || []));
  }, []);

  async function generate(report) {
    if (report !== 'Executive Treasury Report') {
      window.alert(`${report} generation is not yet available - only the Executive Treasury Report can be downloaded today.`);
      return;
    }
    setGenerating(report);
    try {
      const { data } = await api.get('/reports/executive-summary/download', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Executive_Treasury_Report.pptx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setGenerating(null);
    }
  }

  return (
    <div className="page">
      <SectionHeader title="Reporting Centre" eyebrow="PowerPoint, PDF and Excel report catalogue" />
      <div className="report-grid">
        {reports.map(report => {
          const reportLabel = report.replace('Borrowings', terms.borrowings);
          return (
          <article className="panel report-card" key={report}>
            <h3>{reportLabel}</h3>
            <p>Prepared from tenant-scoped treasury, portfolio and ECL data.</p>
            <button onClick={() => generate(report)} disabled={generating === report}>
              <Download size={16} />{generating === report ? 'Generating...' : 'Generate'}
            </button>
          </article>
        );})}
      </div>
    </div>
  );
}
