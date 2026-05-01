import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-t-2 border-brand-charcoal rounded-full animate-spin" />
          <span className="text-[10px] uppercase tracking-widest font-black text-brand-charcoal/40 tracking-wider">Verifying Authorized Access...</span>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    console.warn("[ProtectedRoute] No user profile found, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log(`[ProtectedRoute] User: ${userProfile.email}, Role: ${userProfile.role}`);

  if (requireAdmin && userProfile.role !== 'admin') {
    console.warn("[ProtectedRoute] Admin role required, redirecting to user dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  if (userProfile.requiresPasswordReset && location.pathname !== '/reset-password') {
    return <Navigate to="/reset-password" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
