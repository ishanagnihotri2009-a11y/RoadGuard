import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute({ children, requireAdmin = false }: { children: JSX.Element, requireAdmin?: boolean }) {
  const { user, userRole, loading } = useApp();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (!requireAdmin && userRole === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
