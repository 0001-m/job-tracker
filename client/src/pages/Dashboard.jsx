import { useEffect } from 'react';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const STATUS_COLORS = {
  Applied: '#3b82f6',
  Screening: '#f59e0b',
  Interview: '#8b5cf6',
  Offer: '#10b981',
  Rejected: '#ef4444'
};

const Dashboard = () => {
  const { stats, fetchStats } = useJobs();
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []); // run once on mount

  if (!stats) return <p>Loading stats...</p>;

  const pieData = stats.byStatus.map(s => ({
    name: s._id,
    value: s.count
  }));

  const barData = stats.byMonth.map(m => ({
    month: m._id,
    applications: m.count
  }));

  return (
    <div>
      <h2>Welcome back, {user?.name} 👋</h2>

      {/* Stats cards */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', margin: '1.5rem 0' }}>
        {[
          { label: 'Total Applications', value: stats.total, color: '#3b82f6' },
          { label: 'Response Rate', value: `${stats.responseRate}%`, color: '#10b981' },
          { label: 'Follow-ups This Week', value: stats.followUps.length, color: '#f59e0b' }
        ].map(card => (
          <div key={card.label} style={{
            background: card.color, color: '#fff',
            padding: '1.2rem 1.8rem', borderRadius: '8px',
            minWidth: '180px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{card.value}</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div>
          <h3>Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map(entry => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#888'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3>Applications Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="applications" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Follow-up reminders */}
      {stats.followUps.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>📅 Follow-ups Due This Week</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {stats.followUps.map(j => (
              <div key={j._id} style={{
                background: '#fef3c7', border: '1px solid #fbbf24',
                borderRadius: '6px', padding: '0.75rem 1rem'
              }}>
                <strong>{j.company}</strong> — {j.role} &nbsp;
                <span style={{ color: '#92400e', fontSize: '0.85rem' }}>
                  Due: {new Date(j.followUpDate).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;