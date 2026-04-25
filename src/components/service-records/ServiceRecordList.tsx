import React from 'react';
import { 
  Car, 
  Bike,
  User, 
  Clock, 
  DollarSign, 
  Edit2, 
  Trash2, 
  CheckCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import { ServiceRecord, ServiceRecordStatus } from '../../types/serviceRecord';
import Button from '../common/Button';

interface ServiceRecordListProps {
  records: ServiceRecord[];
  onEdit: (record: ServiceRecord) => void;
  onStatusChange: (id: string, status: ServiceRecordStatus) => void;
  onCancel: (id: string) => void;
}

const ServiceRecordList: React.FC<ServiceRecordListProps> = ({ 
  records, 
  onEdit, 
  onStatusChange, 
  onCancel 
}) => {
  
  const getStatusBadge = (status: ServiceRecordStatus) => {
    switch (status) {
      case 'aberto':
        return <span className="status-badge" style={{ backgroundColor: '#E1F3FF', color: '#007AFF' }}>Aberto</span>;
      case 'em_execucao':
        return <span className="status-badge" style={{ backgroundColor: '#FFF9E8', color: '#EBB43F' }}>Em Execução</span>;
      case 'concluido':
        return <span className="status-badge" style={{ backgroundColor: '#E1F9EB', color: '#34C759' }}>Concluído</span>;
      case 'cancelado':
        return <span className="status-badge" style={{ backgroundColor: '#FFEBEB', color: '#FF3B30' }}>Cancelado</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (records.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
        Nenhum serviço realizado encontrado.
      </div>
    );
  }

  return (
    <div className="list-grid">
      {records.map((record) => (
        <div key={record.id} className="list-item card" style={{ display: 'block', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-dark)' }}>{record.titulo}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                {getStatusBadge(record.status)}
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Ref: {record.id.slice(0, 8)}
                </span>
              </div>
            </div>
            
            <div className="item-actions" style={{ display: 'flex', gap: '8px' }}>
              <Button 
                variant="action" 
                onClick={() => onEdit(record)}
                title="Editar"
                style={{ backgroundColor: 'transparent', color: 'var(--text-dark)', border: '1px solid #ddd', padding: '0.4rem' }}
              >
                <Edit2 size={16} />
              </Button>
              
              {record.status === 'aberto' && (
                <Button 
                  variant="action" 
                  onClick={() => onStatusChange(record.id, 'em_execucao')}
                  title="Iniciar"
                  style={{ backgroundColor: 'transparent', color: '#007AFF', border: '1px solid #CCE5FF', padding: '0.4rem' }}
                >
                  <Play size={16} />
                </Button>
              )}
              
              {record.status === 'em_execucao' && (
                <Button 
                  variant="action" 
                  onClick={() => onStatusChange(record.id, 'concluido')}
                  title="Finalizar"
                  style={{ backgroundColor: 'transparent', color: '#34C759', border: '1px solid #E1F9EB', padding: '0.4rem' }}
                >
                  <CheckCircle size={16} />
                </Button>
              )}

              {record.status === 'concluido' && (
                <Button 
                  variant="action" 
                  onClick={() => onStatusChange(record.id, 'em_execucao')}
                  title="Reabrir"
                  style={{ backgroundColor: 'transparent', color: '#EBB43F', border: '1px solid #FFF9E8', padding: '0.4rem' }}
                >
                  <RotateCcw size={16} />
                </Button>
              )}

              <Button 
                variant="action" 
                onClick={() => onCancel(record.id)}
                title="Cancelar"
                className="delete-btn"
                style={{ backgroundColor: 'transparent', color: '#FF3B30', border: '1px solid #FFEBEB', padding: '0.4rem' }}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                <User size={16} />
              </div>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span className="item-subtext">Cliente</span>
                <span className="item-name" style={{ fontSize: '0.9rem' }}>{record.cliente?.nome || 'Ex-cliente'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem', backgroundColor: '#F0F0F0' }}>
                {record.veiculo?.tipo_veiculo === 'moto' ? <Bike size={16} /> : <Car size={16} />}
              </div>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span className="item-subtext">Veículo</span>
                <span className="item-name" style={{ fontSize: '0.9rem' }}>
                  {record.veiculo ? (
                    <>
                      <span style={{ fontSize: '0.7rem', textTransform: 'capitalize', color: 'var(--text-muted)' }}>
                        {record.veiculo.tipo_veiculo || 'Carro'} •
                      </span> {record.veiculo.marca} {record.veiculo.modelo}
                    </>
                  ) : 'Sem veículo'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingTop: '1rem', 
            borderTop: '1px solid #f0f0f0',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                <Clock size={14} />
                <span>{record.tempo_real_minutos || record.tempo_estimado_minutos} min</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-dark)', fontWeight: '600' }}>
                <DollarSign size={14} />
                <span>{record.valor_cobrado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              {formatDate(record.created_at)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceRecordList;
