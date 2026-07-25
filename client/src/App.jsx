import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';

function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [dark]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <JobProvider>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/jobs" element={
                <ProtectedRoute><Jobs /></ProtectedRoute>
              } />
            </Routes>
          </div>
          <button 
            onClick={() => setDark(d => !d)} 
            style={{ position: 'fixed', bottom: '1rem', right: '1rem', padding: '0.6rem', borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'var(--card-bg)', color: 'var(--text-color)', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', display: 'flex' }}
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </JobProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;