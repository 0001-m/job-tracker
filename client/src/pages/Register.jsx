import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <h2>Register</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input placeholder="Full Name" required value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={{ padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }} />
        <input type="email" placeholder="Email" required value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={{ padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }} />
        <input type="password" placeholder="Password (min 6 chars)" required value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          style={{ padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }} />
        <button type="submit"
          style={{ padding: '0.7rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>Already registered? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;