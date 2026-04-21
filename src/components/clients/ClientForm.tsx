import React, { useState, useEffect } from 'react';
import { Mail, Phone, User, MessageSquare, X } from 'lucide-react';
import { Cliente, CreateClientePayload, UpdateClientePayload } from '../../types/client';
import Button from '../common/Button';

interface ClientFormProps {
  client?: Cliente | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    observacoes: ''
  });

  useEffect(() => {
    if (client) {
      setFormData({
        nome: client.nome || '',
        telefone: client.telefone || '',
        email: client.email || '',
        observacoes: client.observacoes || ''
      });
    }
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="card" style={{ display: 'block', padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>{client ? 'Editar Cliente' : 'Novo Cliente'}</h3>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="login-form" style={{ gap: '1.2rem' }}>
        <div className="input-group">
          <User size={18} color="var(--primary-gold)" />
          <input 
            type="text" 
            placeholder="Nome Completo *" 
            value={formData.nome}
            onChange={e => setFormData({ ...formData, nome: e.target.value })}
            required 
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <Phone size={18} color="var(--primary-gold)" />
          <input 
            type="text" 
            placeholder="Telefone/WhatsApp *" 
            value={formData.telefone}
            onChange={e => setFormData({ ...formData, telefone: e.target.value })}
            required 
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <Mail size={18} color="var(--primary-gold)" />
          <input 
            type="email" 
            placeholder="E-mail" 
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="input-group" style={{ alignItems: 'flex-start' }}>
          <MessageSquare size={18} color="var(--primary-gold)" style={{ marginTop: '0.5rem' }} />
          <textarea 
            placeholder="Observações" 
            value={formData.observacoes}
            onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
            style={{ minHeight: '80px' }}
            disabled={loading}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <Button 
            type="button" 
            onClick={onCancel}
            style={{ 
              backgroundColor: 'transparent', 
              border: '1px solid #ddd', 
              color: 'var(--text-dark)',
              boxShadow: 'none'
            }}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : client ? 'Salvar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
