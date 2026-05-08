import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, Hash } from 'lucide-react';
import { FinancialReportRow } from '../../types/reports';
import ReportSummaryCard from './ReportSummaryCard';

interface FinancialReportProps {
  data: FinancialReportRow[];
}

const FinancialReport: React.FC<FinancialReportProps> = ({ data }) => {
  const stats = useMemo(() => {
    return data.reduce((acc, row) => {
      acc.total_movimentacoes++;
      
      if (row.status === 'pago') {
        if (row.tipo === 'entrada') acc.total_entradas += row.valor;
        if (row.tipo === 'saida') acc.total_saidas += row.valor;
      } else if (row.status === 'pendente' || row.status === 'atrasado') {
        if (row.tipo === 'entrada') acc.total_receber += row.valor;
        if (row.tipo === 'saida') acc.total_pagar += row.valor;
      }
      
      return acc;
    }, {
      total_entradas: 0,
      total_saidas: 0,
      total_receber: 0,
      total_pagar: 0,
      total_movimentacoes: 0
    });
  }, [data]);

  const saldo = stats.total_entradas - stats.total_saidas;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    // Add timezone adjustment if needed, but local string is usually fine for simple views
    return new Date(dateStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  return (
    <div className="report-container">
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <ReportSummaryCard 
          title="Saldo (Realizado)" 
          value={formatCurrency(saldo)} 
          icon={<DollarSign />} 
          color={saldo >= 0 ? 'success' : 'danger'} 
        />
        <ReportSummaryCard 
          title="Entradas Pagas" 
          value={formatCurrency(stats.total_entradas)} 
          icon={<TrendingUp />} 
          color="success" 
        />
        <ReportSummaryCard 
          title="Saídas Pagas" 
          value={formatCurrency(stats.total_saidas)} 
          icon={<TrendingDown />} 
          color="danger" 
        />
        <ReportSummaryCard 
          title="Pendente (Entradas)" 
          value={formatCurrency(stats.total_receber)} 
          icon={<AlertCircle />} 
          color="warning" 
        />
        <ReportSummaryCard 
          title="Total Moviment." 
          value={stats.total_movimentacoes} 
          icon={<Hash />} 
          color="info" 
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Data Comp.</th>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Forma Pag.</th>
              <th>Cliente</th>
              <th>Serviço</th>
              <th style={{ textAlign: 'right' }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>Nenhum dado encontrado para os filtros atuais.</td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id}>
                  <td>{formatDate(row.data_competencia)}</td>
                  <td>{row.descricao}</td>
                  <td>
                    <span className="status-badge" style={{
                      backgroundColor: row.tipo === 'entrada' ? 'rgba(56, 203, 137, 0.1)' : 'rgba(255, 77, 77, 0.1)',
                      color: row.tipo === 'entrada' ? 'var(--success-color)' : 'var(--danger-color)',
                    }}>
                      {row.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${row.status}`}>
                      {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </span>
                  </td>
                  <td>{row.forma_pagamento || '-'}</td>
                  <td>{row.cliente_nome || '-'}</td>
                  <td>{row.servico_titulo || '-'}</td>
                  <td style={{ textAlign: 'right', fontWeight: 500, color: row.tipo === 'entrada' ? 'var(--success-color)' : 'var(--danger-color)' }}>
                    {row.tipo === 'saida' ? '-' : ''}{formatCurrency(row.valor)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialReport;
