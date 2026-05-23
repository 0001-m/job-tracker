import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <JobProvider>
          <Navbar />
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem' }}>
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
        </JobProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;