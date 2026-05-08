import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { settingsService } from '../services/settingsService';
import { SystemSettings, UpdateSystemSettingsPayload } from '../types/settings';
import SettingsForm from '../components/settings/SettingsForm';
import { useAuth } from '../hooks/useAuth';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await settingsService.getSettings();
        setSettings(data);
      } catch (err: any) {
        console.error('Erro ao carregar configurações:', err);
        setError('Não foi possível carregar as configurações do sistema.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (payload: UpdateSystemSettingsPayload) => {
    if (!settings || !user) return;
    
    try {
      setSaving(true);
      setError('');
      setSuccess(false);
      
      const updatedData = await settingsService.updateSettings(settings.id, payload, user.id);
      setSettings(updatedData);
      setSuccess(true);
      
      // Esconder mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Erro ao salvar configurações:', err);
      setError('Ocorreu um erro ao tentar salvar as configurações.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="screen active" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-gold)', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Configurações do Sistema</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Personalize o comportamento e os dados da sua empresa</p>
        </div>
      </div>

      {success && (
        <div className="alert alert-success" style={{ 
          display: 'flex', alignItems: 'center', gap: '0.75rem', 
          backgroundColor: 'rgba(56, 203, 137, 0.1)', color: 'var(--success-color)', 
          padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '2rem',
          border: '1px solid rgba(56, 203, 137, 0.2)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <CheckCircle size={20} />
          <span style={{ fontWeight: 500 }}>Configurações atualizadas com sucesso!</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ 
          display: 'flex', alignItems: 'center', gap: '0.75rem', 
          backgroundColor: 'rgba(255, 77, 77, 0.1)', color: 'var(--danger-color)', 
          padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '2rem',
          border: '1px solid rgba(255, 77, 77, 0.2)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <AlertCircle size={20} />
          <span style={{ fontWeight: 500 }}>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-state" style={{ height: '300px' }}>Carregando configurações...</div>
      ) : settings ? (
        <SettingsForm 
          initialSettings={settings} 
          onSave={handleSave} 
          loading={saving} 
        />
      ) : (
        <div className="empty-state">
          Nenhuma configuração disponível e falha ao criar padrão.
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
