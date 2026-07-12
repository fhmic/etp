import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute() {
  const { user, booting } = useAuth();
  if (booting) return <div className="screen-loader">Loading ETPA...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
