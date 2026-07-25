import { useEffect } from 'react';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Calendar } from 'lucide-react';

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
          { label: 'Total Applications', value: stats.total, color: 'var(--primary-color)' },
          { label: 'Response Rate', value: `${stats.responseRate}%`, color: '#10b981' },
          { label: 'Follow-ups This Week', value: stats.followUps.length, color: '#f59e0b' }
        ].map(card => (
          <div key={card.label} className="card" style={{
            borderTop: `4px solid ${card.color}`,
            minWidth: '180px', textAlign: 'center', flex: 1, padding: '1.5rem'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{card.label}</div>
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
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} className="text-primary" /> Follow-ups Due This Week
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {stats.followUps.map(j => (
              <div key={j._id} className="card" style={{
                borderLeft: '4px solid #f59e0b',
                padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <strong>{j.company}</strong> — {j.role}
                </div>
                <span style={{ color: '#d97706', fontSize: '0.85rem', fontWeight: 500 }}>
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