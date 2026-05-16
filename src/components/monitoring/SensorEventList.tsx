import React from 'react';
import { MonitoringEventRow, EVENT_TYPE_LABELS, SensorEventType } from '../../types/monitoring';

interface SensorEventListProps {
  events: MonitoringEventRow[];
  isLoading: boolean;
}

const getEventColor = (type: SensorEventType): string => {
  switch (type) {
    case 'entrada_detectada': return 'blue';
    case 'lavagem_iniciada': return 'cyan';
    case 'lavagem_finalizada': return 'green';
    case 'acabamento_iniciado': return 'indigo';
    case 'acabamento_finalizado': return 'emerald';
    case 'servico_finalizado': return 'green';
    case 'alerta_atraso': return 'orange';
    case 'alerta_tempo_excedido': return 'red';
    default: return 'gray';
  }
};

const getEventBadgeStyle = (type: SensorEventType) => {
  const colorName = getEventColor(type);
  const colors: Record<string, { bg: string, text: string }> = {
    blue: { bg: '#dbeafe', text: '#1e40af' },
    cyan: { bg: '#cffafe', text: '#164e63' },
    green: { bg: '#dcfce7', text: '#166534' },
    emerald: { bg: '#d1fae5', text: '#065f46' },
    indigo: { bg: '#e0e7ff', text: '#3730a3' },
    orange: { bg: '#ffedd5', text: '#9a3412' },
    red: { bg: '#fee2e2', text: '#991b1b' },
    gray: { bg: '#f3f4f6', text: '#374151' }
  };
  const color = colors[colorName] || colors.gray;
  return {
    backgroundColor: color.bg,
    color: color.text,
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 600,
    display: 'inline-block'
  };
};

const SensorEventList: React.FC<SensorEventListProps> = ({ events, isLoading }) => {
  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando eventos...</div>;
  }

  if (events.length === 0) {
    return (
      <div style={{ background: '#fff', padding: '3rem 2rem', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <p style={{ color: 'var(--text-muted)' }}>Nenhum evento registrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive" style={{ background: '#fff', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'auto' }}>
      <table className="table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-light)', borderBottom: '1px solid var(--border-color)' }}>
            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Data/Hora</th>
            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Evento</th>
            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Serviço</th>
            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Cliente/Veículo</th>
            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Origem</th>
            <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Detalhes</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-dark)' }}>
                {new Intl.DateTimeFormat('pt-BR', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }).format(new Date(event.registrado_em)).replace(', ', ' às ')}
              </td>
              <td style={{ padding: '1rem' }}>
                <span style={getEventBadgeStyle(event.tipo_evento)}>
                  {EVENT_TYPE_LABELS[event.tipo_evento] || event.tipo_evento}
                </span>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-dark)' }}>
                <div style={{ fontWeight: 500 }}>{event.servico_titulo}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{event.servico_status}</div>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-dark)' }}>
                <div style={{ fontWeight: 500 }}>{event.cliente_nome}</div>
                {event.placa && <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{event.placa}</div>}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <span style={{ 
                  padding: '0.125rem 0.375rem', 
                  backgroundColor: event.origem === 'simulado' ? '#f3e8ff' : '#f1f5f9', 
                  color: event.origem === 'simulado' ? '#7e22ce' : '#475569',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  {event.origem}
                </span>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-dark)' }}>
                {event.valor && <div style={{ fontWeight: 500 }}>Valor: {event.valor}</div>}
                {event.descricao && <div style={{ color: 'var(--text-muted)' }}>{event.descricao}</div>}
                {!event.valor && !event.descricao && <span style={{ color: '#cbd5e1' }}>-</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SensorEventList;
