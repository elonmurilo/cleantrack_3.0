import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="screen active" style={{ padding: '2rem', textAlign: 'center' }}>
      <SettingsIcon size={64} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
      <h1 style={{ marginBottom: '1rem' }}>Configurações</h1>
      <p style={{ color: 'var(--text-muted)' }}>Módulo em desenvolvimento.</p>
    </div>
  );
};

export default SettingsPage;
