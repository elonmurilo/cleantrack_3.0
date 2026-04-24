import React from 'react';
import { 
  Edit2, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowUpCircle, 
  ArrowDownCircle,
  MoreVertical
} from 'lucide-react';
import { FinancialRecord, FinancialStatus } from '../../types/financial';
import Button from '../common/Button';

interface FinancialListProps {
  records: FinancialRecord[];
  onEdit: (record: FinancialRecord) => void;
  onStatusChange: (id: string, status: FinancialStatus) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

const FinancialList: React.FC<FinancialListProps> = ({ 
  records, 
  onEdit, 
  onStatusChange, 
  onDelete,
  loading 
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadgeClass = (status: FinancialStatus) => {
    switch (status) {
      case 'pago': return 'status-pago';
      case 'pendente': return 'status-pendente';
      case 'cancelado': return 'status-cancelado';
      default: return '';
    }
  };

  const getStatusIcon = (status: FinancialStatus) => {
    switch (status) {
      case 'pago': return <CheckCircle size={16} />;
      case 'pendente': return <Clock size={16} />;
      case 'cancelado': return <XCircle size={16} />;
      default: return null;
    }
  };

  if (loading) {
    return <div className="loading-container">Carregando movimentações...</div>;
  }

  if (records.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhuma movimentação financeira encontrada.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Data</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Pagamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>
                <div className="flex items-center gap-2">
                  {record.tipo === 'entrada' ? (
                    <ArrowUpCircle size={18} className="text-green-500" />
                  ) : (
                    <ArrowDownCircle size={18} className="text-red-500" />
                  )}
                  <span className="capitalize">{record.tipo}</span>
                </div>
              </td>
              <td>{formatDate(record.data_competencia)}</td>
              <td>
                <div className="flex flex-col">
                  <span className="font-medium">{record.descricao}</span>
                  {record.cliente && (
                    <span className="text-xs text-gray-500">Cliente: {record.cliente.nome}</span>
                  )}
                </div>
              </td>
              <td>{record.categoria}</td>
              <td className={record.tipo === 'entrada' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                {formatCurrency(record.valor)}
              </td>
              <td>
                <span className={`status-badge ${getStatusBadgeClass(record.status)}`}>
                  {getStatusIcon(record.status)}
                  <span className="ml-1 capitalize">{record.status}</span>
                </span>
              </td>
              <td>
                {record.status === 'pago' ? (
                  <div className="flex flex-col text-xs">
                    <span>{record.forma_pagamento || 'N/A'}</span>
                    <span className="text-gray-500">{record.data_pagamento ? formatDate(record.data_pagamento) : ''}</span>
                  </div>
                ) : (
                  <span className="text-gray-400 text-xs">Pendente</span>
                )}
              </td>
              <td>
                <div className="action-buttons">
                  {record.status === 'pendente' && (
                    <Button 
                      variant="action"
                      onClick={() => onStatusChange(record.id, 'pago')}
                      style={{ backgroundColor: 'transparent', color: 'var(--accent-green)', border: '1px solid #dcfce7' }}
                      title="Marcar como Pago"
                    >
                      <CheckCircle size={18} />
                    </Button>
                  )}
                  <Button 
                    variant="action"
                    onClick={() => onEdit(record)}
                    style={{ backgroundColor: 'transparent', color: 'var(--accent-blue)', border: '1px solid #e1f3ff' }}
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </Button>
                  <Button 
                    variant="action"
                    onClick={() => onDelete(record.id)}
                    style={{ backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ffcccc' }}
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialList;
