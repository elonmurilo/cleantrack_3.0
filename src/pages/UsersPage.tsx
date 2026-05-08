import React from 'react';
import { Users as UsersIcon } from 'lucide-react';

const UsersPage: React.FC = () => {
  return (
    <div className="screen active" style={{ padding: '2rem', textAlign: 'center' }}>
      <UsersIcon size={64} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
      <h1 style={{ marginBottom: '1rem' }}>Gestão de Usuários</h1>
      <p style={{ color: 'var(--text-muted)' }}>Módulo em desenvolvimento.</p>
    </div>
  );
};

export default UsersPage;
