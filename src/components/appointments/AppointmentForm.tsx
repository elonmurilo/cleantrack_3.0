import React, { useState, useEffect } from 'react';
import { User, Car, Bike, Calendar, Clock, MessageSquare, X, Tag, AlertCircle } from 'lucide-react';
import { Appointment, AppointmentStatus, CreateAppointmentPayload, UpdateAppointmentPayload } from '../../types/appointment';
import { clientService } from '../../services/clientService';
import { appointmentService } from '../../services/appointmentService';
import { vehicleService } from '../../services/vehicleService';
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
        const data = await vehicleService.listVehiclesByClient(formData.cliente_id);
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
    <div className="modal-overlay">
      <div className="modal-content max-w-2xl">
        <div className="modal-header">
          <h2>{appointment ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
          <button onClick={onCancel} className="btn-close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label>Cliente *</label>
              <div className="input-group">
                <User size={18} color="var(--primary-gold)" />
                <select 
                  value={formData.cliente_id}
                  onChange={handleClientChange}
                  required
                  disabled={loading || fetchingClients}
                >
                  <option value="" disabled>Selecionar Cliente</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Veículo</label>
              <div className="input-group">
                <Car size={18} color="var(--primary-gold)" />
                <select 
                  value={formData.veiculo_id}
                  onChange={e => setFormData({ ...formData, veiculo_id: e.target.value })}
                  disabled={loading || fetchingVehicles || !formData.cliente_id}
                >
                  <option value="">
                    {fetchingVehicles ? 'Carregando...' : vehicles.length === 0 ? 'Nenhum veículo' : 'Selecionar Veículo'}
                  </option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.tipo_veiculo === 'moto' ? 'Moto' : 'Carro'} - {v.marca} {v.modelo} {v.placa ? `- ${v.placa}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formData.cliente_id && !fetchingVehicles && vehicles.length === 0 && (
              <div className="form-group col-span-2">
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '1rem', 
                  backgroundColor: 'rgba(235, 180, 63, 0.05)', 
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(235, 180, 63, 0.2)',
                  color: '#854D0E',
                  fontSize: '0.85rem'
                }}>
                  <AlertCircle size={18} />
                  <span>Este cliente não possui veículo cadastrado. O agendamento será salvo sem veículo.</span>
                </div>
              </div>
            )}

            <div className="form-group col-span-2">
              <label>Título / Serviço Principal *</label>
              <div className="input-group">
                <Tag size={18} color="var(--primary-gold)" />
                <input 
                  type="text" 
                  placeholder="Ex: Lavagem Detalhada" 
                  value={formData.titulo}
                  onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                  required 
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Início Agendado *</label>
              <div className="input-group">
                <Calendar size={18} color="var(--primary-gold)" />
                <input 
                  type="datetime-local" 
                  value={formData.inicio_agendado}
                  onChange={e => setFormData({ ...formData, inicio_agendado: e.target.value })}
                  required 
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tempo Estimado (Minutos) *</label>
              <div className="input-group">
                <Clock size={18} color="var(--primary-gold)" />
                <input 
                  type="number" 
                  placeholder="Ex: 60" 
                  value={formData.tempo_estimado_minutos}
                  onChange={e => setFormData({ ...formData, tempo_estimado_minutos: parseInt(e.target.value) })}
                  min="1"
                  required 
                  disabled={loading}
                />
              </div>
            </div>

            {appointment && (
              <div className="form-group col-span-2">
                <label>Status do Agendamento *</label>
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
              </div>
            )}

            <div className="form-group col-span-2">
              <label>Observações</label>
              <div className="input-group" style={{ alignItems: 'flex-start' }}>
                <MessageSquare size={18} color="var(--primary-gold)" style={{ marginTop: '0.5rem' }} />
                <textarea 
                  placeholder="Ex: Cliente prefere buscar no fim do dia..." 
                  value={formData.observacoes}
                  onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
                  style={{ minHeight: '80px' }}
                  disabled={loading}
                />
              </div>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <Button 
            type="button" 
            onClick={onCancel}
            style={{ 
              backgroundColor: 'transparent', 
              border: '1px solid var(--border-color)', 
              color: 'var(--text-dark)',
              boxShadow: 'none'
            }}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Salvando...' : appointment ? 'Salvar Alterações' : 'Confirmar Agendamento'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
