import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getDefaultRoute } from '../config/permissions';
import Button from '../components/common/Button';

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleGoBack = () => {
    const defaultRoute = getDefaultRoute(profile?.papel);
    navigate(defaultRoute);
  };

  return (
    <div className="screen active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: '100vh', textAlign: 'center', padding: '2rem' }}>
      <ShieldAlert size={64} color="var(--danger-color, #ff4d4d)" style={{ marginBottom: '1rem' }} />
      <h1 style={{ marginBottom: '1rem', color: 'var(--text-color)' }}>Acesso Negado</h1>
      <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Você não possui permissão para acessar esta área.</p>
      <Button onClick={handleGoBack}>Voltar ao Início</Button>
    </div>
  );
};

export default AccessDenied;
