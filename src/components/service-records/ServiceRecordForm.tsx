import React, { useState, useEffect } from 'react';
import { 
  User, 
  Car, 
  Bike,
  Calendar, 
  Clock, 
  MessageSquare, 
  X, 
  Tag, 
  DollarSign,
  Activity
} from 'lucide-react';
import { ServiceRecord, ServiceRecordStatus } from '../../types/serviceRecord';
import { clientService } from '../../services/clientService';
import { vehicleService } from '../../services/vehicleService';
import { appointmentService } from '../../services/appointmentService';
import { Cliente } from '../../types/client';
import { ClientVehicle } from '../../types/vehicle';
import { Appointment } from '../../types/appointment';
import Button from '../common/Button';
import ServicePhotoUpload from './ServicePhotoUpload';
import ServicePhotoGallery from './ServicePhotoGallery';

interface ServiceRecordFormProps {
  record?: ServiceRecord | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const ServiceRecordForm: React.FC<ServiceRecordFormProps> = ({ 
  record, 
  onSubmit, 
  onCancel, 
  loading 
}) => {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [vehicles, setVehicles] = useState<ClientVehicle[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  const [fetchingClients, setFetchingClients] = useState(false);
  const [fetchingVehicles, setFetchingVehicles] = useState(false);
  const [fetchingAppointments, setFetchingAppointments] = useState(false);

  const [formData, setFormData] = useState({
    cliente_id: '',
    veiculo_id: '',
    agendamento_id: '',
    titulo: '',
    descricao_servico: '',
    status: 'aberto' as ServiceRecordStatus,
    valor_cobrado: 0,
    tempo_estimado_minutos: 60,
    tempo_real_minutos: 0,
    inicio_realizado_em: '',
    fim_realizado_em: '',
    observacoes: ''
  });

  const [refreshPhotos, setRefreshPhotos] = useState(0);

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      setFetchingClients(true);
      setFetchingAppointments(true);
      try {
        const [clientsData, appointmentsData] = await Promise.all([
          clientService.listClients(),
          appointmentService.listAppointments()
        ]);
        setClients(clientsData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      } finally {
        setFetchingClients(false);
        setFetchingAppointments(false);
      }
    };
    loadInitialData();
  }, []);

  // Preencher form se for edição
  useEffect(() => {
    if (record) {
      setFormData({
        cliente_id: record.cliente_id || '',
        veiculo_id: record.veiculo_id || '',
        agendamento_id: record.agendamento_id || '',
        titulo: record.titulo || '',
        descricao_servico: record.descricao_servico || '',
        status: record.status || 'aberto',
        valor_cobrado: record.valor_cobrado || 0,
        tempo_estimado_minutos: record.tempo_estimado_minutos || 60,
        tempo_real_minutos: record.tempo_real_minutos || 0,
        inicio_realizado_em: record.inicio_realizado_em ? formatToLocalISO(new Date(record.inicio_realizado_em)) : '',
        fim_realizado_em: record.fim_realizado_em ? formatToLocalISO(new Date(record.fim_realizado_em)) : '',
        observacoes: record.observacoes || ''
      });
    }
  }, [record]);

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
    
    // Converter datas de volta se preenchidas
    const payload = {
      ...formData,
      inicio_realizado_em: formData.inicio_realizado_em ? new Date(formData.inicio_realizado_em).toISOString() : null,
      fim_realizado_em: formData.fim_realizado_em ? new Date(formData.fim_realizado_em).toISOString() : null
    };

    onSubmit(payload);
  };

  const formatToLocalISO = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ 
      ...formData, 
      cliente_id: e.target.value,
      veiculo_id: '',
      agendamento_id: ''
    });
  };

  const calculateMinutes = (start: string, end: string) => {
    if (!start || !end) return 0;
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diff = Math.max(0, Math.floor((e - s) / 60000));
    return diff;
  };

  const calculateEndTime = (start: string, minutes: number) => {
    if (!start) return '';
    const s = new Date(start).getTime();
    const e = new Date(s + minutes * 60000);
    return formatToLocalISO(e);
  };

  const handleStartTimeChange = (val: string) => {
    // Quando muda o início, mantemos o tempo real e recalculamos o fim
    const newEnd = calculateEndTime(val, formData.tempo_real_minutos);
    setFormData({ 
      ...formData, 
      inicio_realizado_em: val, 
      fim_realizado_em: newEnd 
    });
  };

  const handleEndTimeChange = (val: string) => {
    // Quando muda o fim, recalculamos o tempo real
    const minutes = calculateMinutes(formData.inicio_realizado_em, val);
    setFormData({ 
      ...formData, 
      fim_realizado_em: val, 
      tempo_real_minutos: minutes 
    });
  };

  const handleRealTimeChange = (minutes: number) => {
    // Quando muda o tempo real, recalculamos o fim
    const newEnd = calculateEndTime(formData.inicio_realizado_em, minutes);
    setFormData({ 
      ...formData, 
      tempo_real_minutos: minutes, 
      fim_realizado_em: newEnd 
    });
  };

  const handleAppointmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const apptId = e.target.value;
    const appt = appointments.find(a => a.id === apptId);
    
    if (appt) {
      const startDate = new Date(appt.inicio_agendado);
      const formattedStart = formatToLocalISO(startDate);
      const estimatedMin = appt.tempo_estimado_minutos || 60;
      
      const endDate = new Date(startDate.getTime() + estimatedMin * 60000);
      const formattedEnd = formatToLocalISO(endDate);

      setFormData({
        ...formData,
        agendamento_id: apptId,
        cliente_id: appt.cliente_id,
        veiculo_id: appt.veiculo_id || '',
        titulo: appt.titulo,
        descricao_servico: appt.descricao_servico || '',
        tempo_estimado_minutos: estimatedMin,
        tempo_real_minutos: estimatedMin, // Inicia igual ao estimado
        inicio_realizado_em: formattedStart,
        fim_realizado_em: formattedEnd
      });
    } else {
      setFormData({ ...formData, agendamento_id: '' });
    }
  };

  return (
    <div className="card" style={{ display: 'block', padding: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>{record ? 'Editar Registro' : 'Novo Serviço Realizado'}</h3>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="login-form" style={{ gap: '1rem' }}>
        
        <div className="input-group">
          <Calendar size={18} color="var(--primary-gold)" />
          <select 
            value={formData.agendamento_id}
            onChange={handleAppointmentChange}
            disabled={loading || fetchingAppointments}
          >
            <option value="">Vincular a um Agendamento (Opcional)</option>
            {appointments.filter(a => a.ativo).map(a => (
              <option key={a.id} value={a.id}>
                {new Date(a.inicio_agendado).toLocaleDateString()} - {a.titulo} ({a.cliente?.nome})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                {fetchingVehicles ? 'Carregando veículos...' : vehicles.length === 0 ? 'Nenhum veículo' : 'Selecionar Veículo'}
              </option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.tipo_veiculo === 'moto' ? 'Moto' : 'Carro'} - {v.marca} {v.modelo} ({v.placa || 'Sem placa'})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="input-group">
          <Tag size={18} color="var(--primary-gold)" />
          <input 
            type="text" 
            placeholder="Título do Serviço *" 
            value={formData.titulo}
            onChange={e => setFormData({ ...formData, titulo: e.target.value })}
            required 
            disabled={loading}
          />
        </div>

        <div className="input-group" style={{ alignItems: 'flex-start' }}>
          <MessageSquare size={18} color="var(--primary-gold)" style={{ marginTop: '0.5rem' }} />
          <textarea 
            placeholder="Descrição detalhada" 
            value={formData.descricao_servico}
            onChange={e => setFormData({ ...formData, descricao_servico: e.target.value })}
            style={{ minHeight: '80px' }}
            disabled={loading}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
          <div className="input-group">
            <Activity size={18} color="var(--primary-gold)" />
            <select 
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as ServiceRecordStatus })}
              required
              disabled={loading}
            >
              <option value="aberto">Aberto</option>
              <option value="em_execucao">Em execução</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div className="input-group">
            <DollarSign size={18} color="var(--primary-gold)" />
            <input 
              type="number" 
              step="0.01"
              placeholder="Valor Cobrado (R$)" 
              value={formData.valor_cobrado}
              onChange={e => setFormData({ ...formData, valor_cobrado: parseFloat(e.target.value) })}
              required 
              disabled={loading}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <Clock size={18} color="var(--primary-gold)" />
            <input 
              type="number" 
              placeholder="Tempo Estimado (min)" 
              value={formData.tempo_estimado_minutos}
              onChange={e => setFormData({ ...formData, tempo_estimado_minutos: parseInt(e.target.value) })}
              required 
              disabled={loading}
              title="Tempo estimado em minutos"
            />
          </div>

          <div className="input-group">
            <Clock size={18} color="#34C759" />
            <input 
              type="number" 
              placeholder="Tempo Real (min)" 
              value={formData.tempo_real_minutos}
              onChange={e => handleRealTimeChange(parseInt(e.target.value) || 0)}
              disabled={loading}
              title="Tempo real decorrido em minutos"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <input 
              type="datetime-local" 
              value={formData.inicio_realizado_em}
              onChange={e => handleStartTimeChange(e.target.value)}
              disabled={loading}
              title="Início da execução"
            />
          </div>

          <div className="input-group">
            <input 
              type="datetime-local" 
              value={formData.fim_realizado_em}
              onChange={e => handleEndTimeChange(e.target.value)}
              disabled={loading}
              title="Fim da execução"
            />
          </div>
        </div>

        <div className="input-group" style={{ alignItems: 'flex-start' }}>
          <MessageSquare size={18} color="#999" style={{ marginTop: '0.5rem' }} />
          <textarea 
            placeholder="Observações internas" 
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
            style={{ 
              backgroundColor: 'transparent', 
              border: '1px solid #ddd', 
              color: 'var(--text-dark)',
              boxShadow: 'none',
              padding: '1rem'
            }}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : record ? 'Salvar Alterações' : 'Registrar Serviço'}
          </Button>
        </div>
      </form>

      {record && (
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
          <h4 style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary-gold)', paddingLeft: '1rem' }}>
            Galeria do Atendimento
          </h4>
          
          <ServicePhotoUpload 
            serviceId={record.id} 
            onUploadSuccess={() => setRefreshPhotos(prev => prev + 1)} 
          />

          <div style={{ marginTop: '2rem' }}>
            <ServicePhotoGallery serviceId={record.id} refreshTrigger={refreshPhotos} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRecordForm;
