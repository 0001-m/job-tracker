import { useEffect, useState } from 'react';
import { useJobs } from '../context/JobContext';

const STATUSES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];
const PLATFORMS = ['LinkedIn', 'Naukri', 'Indeed', 'AngelList', 'Company Website', 'Referral', 'Other'];

const emptyForm = {
  company: '', role: '', dateApplied: new Date().toISOString().split('T')[0],
  jobUrl: '', platform: 'Other', status: 'Applied',
  contactPerson: '', notes: '', followUpDate: ''
};

const Jobs = () => {
  const { jobs, loading, fetchJobs, addJob, updateJob, deleteJob } = useJobs();
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs(filters);
  }, [filters]); // re-fetch whenever filters change

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await updateJob(editId, form);
      } else {
        await addJob(form);
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (job) => {
    setForm({
      ...job,
      dateApplied: job.dateApplied?.split('T')[0] || '',
      followUpDate: job.followUpDate?.split('T')[0] || ''
    });
    setEditId(job._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return;
    await deleteJob(id);
  };

  // CSV Export
  const exportCSV = () => {
    const headers = ['Company', 'Role', 'Status', 'Platform', 'Date Applied', 'Contact', 'Notes', 'Job URL'];
    const rows = jobs.map(j => [
      j.company, j.role, j.status, j.platform,
      new Date(j.dateApplied).toLocaleDateString(),
      j.contactPerson || '', j.notes || '', j.jobUrl || ''
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'jobs.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const statusColor = { Applied: '#3b82f6', Screening: '#f59e0b', Interview: '#8b5cf6', Offer: '#10b981', Rejected: '#ef4444' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Applications ({jobs.length})</h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={exportCSV} style={{ padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', border: '1px solid #cbd5e1' }}>
            Export CSV
          </button>
          <button onClick={() => { setShowForm(!showForm); setForm(emptyForm); setEditId(null); }}
            style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {showForm ? 'Cancel' : '+ Add Application'}
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ marginTop: 0 }}>{editId ? 'Edit Application' : 'New Application'}</h3>
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Company *', key: 'company', required: true },
                { label: 'Role *', key: 'role', required: true },
                { label: 'Contact Person', key: 'contactPerson' },
                { label: 'Job URL', key: 'jobUrl' },
              ].map(({ label, key, required }) => (
                <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.9rem' }}>
                  {label}
                  <input required={required} value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                </label>
              ))}
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.9rem' }}>
                Date Applied
                <input type="date" value={form.dateApplied} onChange={e => setForm({ ...form, dateApplied: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.9rem' }}>
                Follow-up Date
                <input type="date" value={form.followUpDate} onChange={e => setForm({ ...form, followUpDate: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.9rem' }}>
                Platform
                <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                  {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.9rem' }}>
                Status
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </label>
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.9rem', marginTop: '1rem' }}>
              Notes
              <textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3}
                style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', resize: 'vertical' }} />
            </label>
            <button type="submit" style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {editId ? 'Update' : 'Add Application'}
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input placeholder="Search company, role, notes..." value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
          style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', flex: 1, minWidth: '200px' }} />
        <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}
          style={{ padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Jobs Table */}
      {loading ? <p>Loading...</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                {['Company', 'Role', 'Status', 'Platform', 'Date Applied', 'Follow-up', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem' }}>
                    {job.jobUrl ? <a href={job.jobUrl} target="_blank" rel="noopener noreferrer">{job.company}</a> : job.company}
                  </td>
                  <td style={{ padding: '0.75rem' }}>{job.role}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ background: statusColor[job.status], color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem' }}>
                      {job.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{job.platform}</td>
                  <td style={{ padding: '0.75rem' }}>{new Date(job.dateApplied).toLocaleDateString()}</td>
                  <td style={{ padding: '0.75rem' }}>
                    {job.followUpDate ? new Date(job.followUpDate).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <button onClick={() => handleEdit(job)} style={{ marginRight: '0.5rem', cursor: 'pointer', background: '#e2e8f0', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>Edit</button>
                    <button onClick={() => handleDelete(job._id)} style={{ cursor: 'pointer', background: '#fee2e2', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', color: '#ef4444' }}>Del</button>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No applications yet. Add your first one!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Jobs;