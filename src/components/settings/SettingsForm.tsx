import React, { useState } from 'react';
import { Save, Building, Clock, Globe } from 'lucide-react';
import { SystemSettings, UpdateSystemSettingsPayload } from '../../types/settings';
import Button from '../common/Button';

interface SettingsFormProps {
  initialSettings: SystemSettings;
  onSave: (payload: UpdateSystemSettingsPayload) => Promise<void>;
  loading: boolean;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ initialSettings, onSave, loading }) => {
  const [formData, setFormData] = useState<SystemSettings>(initialSettings);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UpdateSystemSettingsPayload = {
      nome_empresa: formData.nome_empresa,
      telefone_empresa: formData.telefone_empresa,
      email_empresa: formData.email_empresa,
      horario_abertura: formData.horario_abertura,
      horario_fechamento: formData.horario_fechamento,
      tempo_padrao_servico_minutos: formData.tempo_padrao_servico_minutos,
      moeda: formData.moeda,
      timezone: formData.timezone,
      permitir_agendamento_sem_veiculo: formData.permitir_agendamento_sem_veiculo,
      exigir_foto_antes_depois: formData.exigir_foto_antes_depois,
    };
    await onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="settings-form">
      {/* Empresa */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
          <Building size={20} />
          Dados da Empresa
        </h3>
        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="nome_empresa">Nome da Empresa</label>
            <input 
              id="nome_empresa"
              name="nome_empresa"
              type="text" 
              value={formData.nome_empresa} 
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefone_empresa">Telefone</label>
            <input 
              id="telefone_empresa"
              name="telefone_empresa"
              type="text" 
              value={formData.telefone_empresa || ''} 
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email_empresa">E-mail</label>
            <input 
              id="email_empresa"
              name="email_empresa"
              type="email" 
              value={formData.email_empresa || ''} 
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Operação */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
          <Clock size={20} />
          Preferências Operacionais
        </h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="horario_abertura">Horário de Abertura</label>
            <input 
              id="horario_abertura"
              name="horario_abertura"
              type="time" 
              value={formData.horario_abertura} 
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="horario_fechamento">Horário de Fechamento</label>
            <input 
              id="horario_fechamento"
              name="horario_fechamento"
              type="time" 
              value={formData.horario_fechamento} 
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tempo_padrao_servico_minutos">Tempo Padrão de Serviço (minutos)</label>
            <input 
              id="tempo_padrao_servico_minutos"
              name="tempo_padrao_servico_minutos"
              type="number" 
              min="1"
              value={formData.tempo_padrao_servico_minutos} 
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group full-width" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: 0 }}>
              <input 
                type="checkbox" 
                name="permitir_agendamento_sem_veiculo"
                checked={formData.permitir_agendamento_sem_veiculo} 
                onChange={handleChange}
                style={{ width: 'auto', marginBottom: 0 }}
              />
              Permitir agendamento sem cadastrar veículo
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: 0 }}>
              <input 
                type="checkbox" 
                name="exigir_foto_antes_depois"
                checked={formData.exigir_foto_antes_depois} 
                onChange={handleChange}
                style={{ width: 'auto', marginBottom: 0 }}
              />
              Exigir fotos de Antes/Depois para finalizar serviços
            </label>
          </div>
        </div>
      </div>

      {/* Regionalização */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
          <Globe size={20} />
          Configurações Regionais
        </h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="moeda">Moeda</label>
            <select 
              id="moeda" 
              name="moeda"
              value={formData.moeda} 
              onChange={handleChange}
              required
            >
              <option value="BRL">Real Brasileiro (BRL)</option>
              <option value="USD">Dólar Americano (USD)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="timezone">Fuso Horário (Timezone)</label>
            <select 
              id="timezone" 
              name="timezone"
              value={formData.timezone} 
              onChange={handleChange}
              required
            >
              <option value="America/Sao_Paulo">America/Sao_Paulo (Brasília)</option>
              <option value="America/Manaus">America/Manaus</option>
              <option value="America/Belem">America/Belem</option>
              <option value="America/Fortaleza">America/Fortaleza</option>
              <option value="America/Recife">America/Recife</option>
              <option value="America/Cuiaba">America/Cuiaba</option>
              <option value="America/Campo_Grande">America/Campo_Grande</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <Button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Save size={18} />
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </form>
  );
};

export default SettingsForm;
