import { useEffect, useState } from 'react';
import { SectionHeader } from '../../components/SectionHeader.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../lib/api.js';

export function OrganisationPage() {
  const { organisation, setOrganisation } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'finance_officer' });

  function loadUsers() {
    api.get('/organisations/users').then(({ data }) => setUsers(data.users || [])).catch(() => setUsers([]));
  }

  useEffect(loadUsers, []);

  async function addUser(event) {
    event.preventDefault();
    await api.post('/organisations/users', form);
    setForm({ name: '', email: '', password: '', role: 'finance_officer' });
    loadUsers();
  }

  async function saveType(type) {
    const { data } = await api.patch('/organisations/current', { organisationType: type });
    setOrganisation(data.organisation);
  }

  return (
    <div className="page">
      <SectionHeader title="Organisation Management" eyebrow="Tenant profile, roles and module access" />
      <article className="panel">
        <h3>{organisation?.name}</h3>
        <div className="segmented inline">
          <label><input type="radio" checked={organisation?.organisationType === 'financial_services'} onChange={() => saveType('financial_services')} />Financial services</label>
          <label><input type="radio" checked={organisation?.organisationType === 'non_financial_services'} onChange={() => saveType('non_financial_services')} />Non-financial services</label>
        </div>
      </article>
      <form className="panel form-grid" onSubmit={addUser}>
        <h3>Add Team Member</h3>
        <label>Name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
        <label>Email<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>
        <label>Role<select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="organisation_admin">Organisation Admin</option>
          <option value="treasury_manager">Treasury Manager</option>
          <option value="credit_risk_manager">Credit Risk Manager</option>
          <option value="finance_officer">Finance Officer</option>
          <option value="view_only_user">View Only User</option>
        </select></label>
        <div className="form-actions"><button className="primary">Create User</button></div>
      </form>
      <article className="panel">
        <h3>Team Members</h3>
        <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead><tbody>
          {users.map(user => <tr key={user._id}><td>{user.name}</td><td>{user.email}</td><td>{user.role?.replaceAll('_', ' ')}</td><td>{user.active ? 'Active' : 'Disabled'}</td></tr>)}
        </tbody></table></div>
      </article>
    </div>
  );
}
