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
    <div className="card" style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <h2>Register</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input placeholder="Full Name" required value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="input-field" />
        <input type="email" placeholder="Email" required value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="input-field" />
        <input type="password" placeholder="Password (min 6 chars)" required value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="input-field" />
        <button type="submit" className="btn btn-primary" style={{ background: '#10b981', justifyContent: 'center' }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>Already registered? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;