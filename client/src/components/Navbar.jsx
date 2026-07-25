import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: 'var(--nav-bg)', color: 'var(--nav-text)', padding: '1rem 0', marginBottom: '2rem' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'var(--nav-text)', fontWeight: 700, textDecoration: 'none', fontSize: '1.2rem' }}>
          JobTracker
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {user ? (
            <>
              <Link to="/dashboard" style={{ color: 'var(--border-color)' }}>Dashboard</Link>
              <Link to="/jobs" style={{ color: 'var(--border-color)' }}>Applications</Link>
              <span style={{ color: 'var(--border-color)', opacity: 0.5 }}>|</span>
              <span style={{ fontSize: '0.9rem' }}>{user.name}</span>
              <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }}>
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--nav-text)' }}>Login</Link>
              <Link to="/register" style={{ color: 'var(--nav-text)' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;