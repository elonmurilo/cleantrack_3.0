import React, { useMemo } from 'react';
import { Users, Car, UserX, Briefcase, DollarSign } from 'lucide-react';
import { ClientsReportRow } from '../../types/reports';
import ReportSummaryCard from './ReportSummaryCard';

interface ClientsReportProps {
  data: ClientsReportRow[];
}

const ClientsReport: React.FC<ClientsReportProps> = ({ data }) => {
  const stats = useMemo(() => {
    return data.reduce((acc, row) => {
      acc.total_clientes++;
      
      if (row.total_veiculos > 0) acc.com_veiculos++;
      else acc.sem_veiculos++;
      
      acc.total_servicos += Number(row.total_servicos) || 0;
      acc.valor_total += Number(row.valor_total_servicos) || 0;
      
      return acc;
    }, {
      total_clientes: 0,
      com_veiculos: 0,
      sem_veiculos: 0,
      total_servicos: 0,
      valor_total: 0
    });
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  return (
    <div className="report-container">
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <ReportSummaryCard 
          title="Total de Clientes" 
          value={stats.total_clientes} 
          icon={<Users />} 
          color="primary" 
        />
        <ReportSummaryCard 
          title="Com Veículos" 
          value={stats.com_veiculos} 
          icon={<Car />} 
          color="success" 
        />
        <ReportSummaryCard 
          title="Sem Veículos" 
          value={stats.sem_veiculos} 
          icon={<UserX />} 
          color="warning" 
        />
        <ReportSummaryCard 
          title="Serviços Vinculados" 
          value={stats.total_servicos} 
          icon={<Briefcase />} 
          color="info" 
        />
        <ReportSummaryCard 
          title="LTV (Valor Total)" 
          value={formatCurrency(stats.valor_total)} 
          icon={<DollarSign />} 
          color="success" 
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Contato</th>
              <th style={{ textAlign: 'center' }}>Veículos</th>
              <th style={{ textAlign: 'center' }}>Serviços (Concluídos / Total)</th>
              <th style={{ textAlign: 'right' }}>Valor Total</th>
              <th>Último Serviço</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Nenhum cliente encontrado para os filtros atuais.</td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontWeight: 500 }}>
                    {row.nome}
                    {!row.ativo && <span className="status-badge" style={{ marginLeft: '0.5rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>Inativo</span>}
                  </td>
                  <td>
                    {row.telefone && <div style={{ fontSize: '0.9em' }}>{row.telefone}</div>}
                    {row.email && <div style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>{row.email}</div>}
                    {!row.telefone && !row.email && '-'}
                  </td>
                  <td style={{ textAlign: 'center' }}>{row.total_veiculos}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ color: 'var(--success-color)', fontWeight: 500 }}>{row.total_servicos_concluidos}</span> 
                    <span style={{ color: 'var(--text-muted)' }}> / {row.total_servicos}</span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 500 }}>{formatCurrency(Number(row.valor_total_servicos) || 0)}</td>
                  <td style={{ fontSize: '0.9em' }}>{formatDate(row.ultimo_servico_em)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsReport;
