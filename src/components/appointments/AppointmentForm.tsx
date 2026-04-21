import React, { useState, useEffect } from 'react';
import { User, Car, Calendar, Clock, MessageSquare, X, Tag } from 'lucide-react';
import { Appointment, AppointmentStatus, CreateAppointmentPayload, UpdateAppointmentPayload } from '../../types/appointment';
import { clientService } from '../../services/clientService';
import { appointmentService } from '../../services/appointmentService';
import { Cliente } from '../../types/client';
import Button from '../common/Button';

interface AppointmentFormProps {
  appointment?: Appointment | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ appointment, onSubmit, onCancel, loading }) => {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [fetchingClients, setFetchingClients] = useState(false);
  const [fetchingVehicles, setFetchingVehicles] = useState(false);

  const [formData, setFormData] = useState({
    cliente_id: '',
    veiculo_id: '',
    titulo: '',
    descricao_servico: '',
    inicio_agendado: '',
    tempo_estimado_minutos: 60,
    status: 'agendado' as AppointmentStatus,
    observacoes: ''
  });

  // Carregar clientes ao montar o componente
  useEffect(() => {
    const loadClients = async () => {
      setFetchingClients(true);
      try {
        const data = await clientService.listClients();
        setClients(data);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      } finally {
        setFetchingClients(false);
      }
    };
    loadClients();
  }, []);

  // Preencher form se for edição
  useEffect(() => {
    if (appointment) {
      const date = new Date(appointment.inicio_agendado);
      // Formatar para datetime-local (yyyy-MM-ddThh:mm)
      const formattedDate = date.toISOString().slice(0, 16);
      
      setFormData({
        cliente_id: appointment.cliente_id || '',
        veiculo_id: appointment.veiculo_id || '',
        titulo: appointment.titulo || '',
        descricao_servico: appointment.descricao_servico || '',
        inicio_agendado: formattedDate,
        tempo_estimado_minutos: appointment.tempo_estimado_minutos || 60,
        status: appointment.status || 'agendado',
        observacoes: appointment.observacoes || ''
      });
    } else {
      // Data padrão: hoje na próxima hora cheia
      const now = new Date();
      now.setHours(now.getHours() + 1, 0, 0, 0);
      setFormData(prev => ({
        ...prev,
        inicio_agendado: now.toISOString().slice(0, 16)
      }));
    }
  }, [appointment]);

  // Carregar veículos quando mudar o cliente
  useEffect(() => {
    const loadVehicles = async () => {
      if (!formData.cliente_id) {
        setVehicles([]);
        return;
      }
      
      setFetchingVehicles(true);
      try {
        const data = await appointmentService.listCustomerVehicles(formData.cliente_id);
        setVehicles(data || []);
      } catch (error) {
        console.error('Erro ao carregar veículos:', error);
      } finally {
        setFetchingVehicles(false);
      }
    };
    loadVehicles();
  }, [formData.cliente_id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ 
      ...formData, 
      cliente_id: e.target.value,
      veiculo_id: '' // Resetar veículo ao mudar cliente
    });
  };

  return (
    <div className="card" style={{ display: 'block', padding: '1.5rem', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>{appointment ? 'Editar Agendamento' : 'Novo Agendamento'}</h3>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="login-form" style={{ gap: '1rem' }}>
        <div className="input-group">
          <User size={18} color="var(--primary-gold)" />
          <select 
            value={formData.cliente_id}
            onChange={handleClientChange}
            required
            disabled={loading || fetchingClients}
          >
            <option value="" disabled>Selecionar Cliente *</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <Car size={18} color="var(--primary-gold)" />
          <select 
            value={formData.veiculo_id}
            onChange={e => setFormData({ ...formData, veiculo_id: e.target.value })}
            disabled={loading || fetchingVehicles || !formData.cliente_id}
          >
            <option value="">
              {fetchingVehicles ? 'Carregando veículos...' : vehicles.length === 0 ? 'Nenhum veículo cadastrado' : 'Selecionar Veículo (Opcional)'}
            </option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.modelo} - {v.placa}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <Tag size={18} color="var(--primary-gold)" />
          <input 
            type="text" 
            placeholder="Título / Serviço Principal *" 
            value={formData.titulo}
            onChange={e => setFormData({ ...formData, titulo: e.target.value })}
            required 
            disabled={loading}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <Calendar size={18} color="var(--primary-gold)" />
            <input 
              type="datetime-local" 
              value={formData.inicio_agendado}
              onChange={e => setFormData({ ...formData, inicio_agendado: e.target.value })}
              required 
              disabled={loading}
              style={{ flex: 1 }}
            />
          </div>

          <div className="input-group">
            <Clock size={18} color="var(--primary-gold)" />
            <input 
              type="number" 
              placeholder="Minutos" 
              value={formData.tempo_estimado_minutos}
              onChange={e => setFormData({ ...formData, tempo_estimado_minutos: parseInt(e.target.value) })}
              min="1"
              required 
              disabled={loading}
              title="Tempo estimado em minutos"
            />
          </div>
        </div>

        {appointment && (
          <div className="input-group">
            <Tag size={18} color="var(--primary-gold)" />
            <select 
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as AppointmentStatus })}
              required
              disabled={loading}
            >
              <option value="agendado">Agendado</option>
              <option value="em_execucao">Em andamento</option>
              <option value="finalizado">Finalizado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        )}

        <div className="input-group" style={{ alignItems: 'flex-start' }}>
          <MessageSquare size={18} color="var(--primary-gold)" style={{ marginTop: '0.5rem' }} />
          <textarea 
            placeholder="Observações" 
            value={formData.observacoes}
            onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
            style={{ minHeight: '60px' }}
            disabled={loading}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <Button 
            type="button" 
            onClick={onCancel}
            variant="action"
            style={{ 
              backgroundColor: 'transparent', 
              border: '1px solid #ddd', 
              color: 'var(--white)',
              boxShadow: 'none'
            }}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : appointment ? 'Salvar' : 'Agendar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
