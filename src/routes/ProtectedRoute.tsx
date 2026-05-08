import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/user';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Verificando sessão...</p>
      </div>
    );
  }

  // Se não houver sessão ou o perfil for inválido/inativo, redireciona para login
  if (!session || !profile || !profile.ativo) {
    return <Navigate to="/login" replace />;
  }

  // Se a rota exige papéis específicos e o usuário não possui
  if (allowedRoles && !allowedRoles.includes(profile.papel)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
