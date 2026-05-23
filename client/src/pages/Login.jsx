import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <h2>Login</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email" placeholder="Email" required
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={{ padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <input
          type="password" placeholder="Password" required
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          style={{ padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button type="submit" disabled={loading}
          style={{ padding: '0.7rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>No account? <Link to="/register">Register</Link></p>
    </div>
  );
};

export default Login;