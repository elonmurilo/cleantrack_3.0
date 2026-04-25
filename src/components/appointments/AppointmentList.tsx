import React from 'react';
import { CalendarCheck, ChevronRight, Edit2, Play, CheckCircle, XCircle, Car, Bike } from 'lucide-react';
import { Appointment, AppointmentStatus } from '../../types/appointment';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

interface AppointmentListProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onCancel: (id: string) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ 
  appointments, 
  onEdit, 
  onStatusChange, 
  onCancel 
}) => {
  if (appointments.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <CalendarCheck size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
        <p>Nenhum agendamento encontrado para hoje.</p>
      </div>
    );
  }

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'agendado': return 'var(--text-muted)';
      case 'em_execucao': return 'var(--primary-gold)';
      case 'finalizado': return '#4AC6B7';
      case 'cancelado': return '#FFB0B0';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusLabel = (status: AppointmentStatus) => {
    switch (status) {
      case 'agendado': return 'Agendado';
      case 'em_execucao': return 'Em andamento';
      case 'finalizado': return 'Finalizado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="list-grid">
      {appointments.map(appointment => (
        <div key={appointment.id} className="list-item" style={{ borderLeft: `4px solid ${getStatusColor(appointment.status)}` }}>
          <Avatar initials={appointment.cliente?.nome.charAt(0) || 'C'} />
          
          <div className="item-details" style={{ flex: 1, marginLeft: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="item-name">{appointment.cliente?.nome || 'Cliente não encontrado'}</span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: getStatusColor(appointment.status) }}>
                {getStatusLabel(appointment.status)}
              </span>
            </div>
            
            <span className="item-subtext" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {appointment.veiculo?.tipo_veiculo === 'moto' ? <Bike size={14} /> : <Car size={14} />}
              {appointment.veiculo ? (
                <span>
                  <span style={{ textTransform: 'capitalize' }}>{appointment.veiculo.tipo_veiculo || 'Carro'}</span> • {appointment.veiculo.modelo} ({appointment.veiculo.placa})
                </span>
              ) : 'Veículo não informado'}
            </span>
            <span className="item-subtext" style={{ fontStyle: 'italic' }}>
              {appointment.titulo}
            </span>
            <div style={{ marginTop: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
              {formatDate(appointment.inicio_agendado)} às {formatTime(appointment.inicio_agendado)}
            </div>
          </div>

          <div className="item-actions" style={{ display: 'flex', gap: '8px' }}>
            {appointment.status === 'agendado' && (
              <button 
                onClick={() => onStatusChange(appointment.id, 'em_execucao')}
                title="Iniciar Serviço"
                style={{ background: 'none', border: 'none', color: 'var(--primary-gold)', cursor: 'pointer' }}
              >
                <Play size={18} />
              </button>
            )}
            
            {appointment.status === 'em_execucao' && (
              <button 
                onClick={() => onStatusChange(appointment.id, 'finalizado')}
                title="Finalizar Serviço"
                style={{ background: 'none', border: 'none', color: '#4AC6B7', cursor: 'pointer' }}
              >
                <CheckCircle size={18} />
              </button>
            )}

            <button 
              onClick={() => onEdit(appointment)}
              title="Editar Agendamento"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <Edit2 size={18} />
            </button>

            <button 
              onClick={() => onCancel(appointment.id)}
              title="Cancelar Agendamento"
              style={{ background: 'none', border: 'none', color: '#FFB0B0', cursor: 'pointer' }}
            >
              <XCircle size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentList;
