import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  // If not logged in, redirect to /login
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;