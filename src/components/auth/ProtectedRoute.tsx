import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Array<'tutor' | 'protector' | 'temporary_home' | 'admin'>;
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, profile, loading, firebaseReady } = useAuth();
  const location = useLocation();

  if (!firebaseReady) {
    return <Navigate to="/setup" replace />;
  }

  if (loading) {
    return (
      <div className="page-center">
        <LoadingSpinner label="Carregando sessão..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!profile) {
    return (
      <div className="page-center">
        <LoadingSpinner label="Carregando perfil..." />
      </div>
    );
  }

  if (roles && !roles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
