import { useEffect, useState } from 'react';
import { SectionHeader } from '../../components/SectionHeader.jsx';
import { api } from '../../lib/api.js';

export function NotificationsPage() {
  const [rows, setRows] = useState([]);

  function load() {
    api.get('/notifications').then(({ data }) => setRows(data.notifications || []));
  }

  useEffect(load, []);

  async function markRead(id) {
    await api.patch(`/notifications/${id}/read`);
    load();
  }

  return (
    <div className="page">
      <SectionHeader title="Notifications" eyebrow="Maturity, delinquency, liquidity and ECL alerts" />
      <div className="notification-list">
        {rows.map(row => (
          <article className={`panel notification ${row.read ? 'read' : ''}`} key={row._id}>
            <div><strong>{row.title}</strong><p>{row.message}</p></div>
            {!row.read && <button onClick={() => markRead(row._id)}>Mark read</button>}
          </article>
        ))}
        {!rows.length && <article className="panel">No notifications yet.</article>}
      </div>
    </div>
  );
}
