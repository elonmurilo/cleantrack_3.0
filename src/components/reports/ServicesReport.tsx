import React, { useMemo } from 'react';
import { Briefcase, CheckCircle, Clock, AlertCircle, Hash, DollarSign } from 'lucide-react';
import { ServicesReportRow } from '../../types/reports';
import ReportSummaryCard from './ReportSummaryCard';

interface ServicesReportProps {
  data: ServicesReportRow[];
}

const ServicesReport: React.FC<ServicesReportProps> = ({ data }) => {
  const stats = useMemo(() => {
    return data.reduce((acc, row) => {
      acc.total_servicos++;
      acc.valor_total += row.valor_cobrado || 0;
      
      if (row.status === 'concluido') acc.concluidos++;
      if (row.status === 'em_execucao') acc.em_execucao++;
      if (row.status === 'cancelado') acc.cancelados++;
      
      if (row.status === 'concluido' && row.tempo_real_minutos) {
        acc.tempo_real_total += row.tempo_real_minutos;
        acc.qtd_com_tempo_real++;
      }
      
      return acc;
    }, {
      total_servicos: 0,
      concluidos: 0,
      em_execucao: 0,
      cancelados: 0,
      valor_total: 0,
      tempo_real_total: 0,
      qtd_com_tempo_real: 0
    });
  }, [data]);

  const tempoMedio = stats.qtd_com_tempo_real > 0 
    ? Math.round(stats.tempo_real_total / stats.qtd_com_tempo_real) 
    : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('pt-BR');
  };

  const formatDuration = (minutes: number | null) => {
    if (minutes === null || minutes === undefined) return '-';
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <div className="report-container">
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <ReportSummaryCard 
          title="Total de Serviços" 
          value={stats.total_servicos} 
          icon={<Briefcase />} 
          color="primary" 
        />
        <ReportSummaryCard 
          title="Concluídos" 
          value={stats.concluidos} 
          icon={<CheckCircle />} 
          color="success" 
        />
        <ReportSummaryCard 
          title="Em Execução" 
          value={stats.em_execucao} 
          icon={<Clock />} 
          color="warning" 
        />
        <ReportSummaryCard 
          title="Valor Total" 
          value={formatCurrency(stats.valor_total)} 
          icon={<DollarSign />} 
          color="info" 
        />
        <ReportSummaryCard 
          title="Tempo Médio Real" 
          value={formatDuration(tempoMedio)} 
          subtitle="Apenas concluídos"
          icon={<Hash />} 
          color="primary" 
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Cliente</th>
              <th>Veículo</th>
              <th>Status</th>
              <th>Valor</th>
              <th>T. Estimado</th>
              <th>T. Real</th>
              <th>Início</th>
              <th>Fim</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>Nenhum dado encontrado para os filtros atuais.</td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontWeight: 500 }}>{row.titulo}</td>
                  <td>{row.cliente_nome}</td>
                  <td>
                    {row.marca && row.modelo ? `${row.marca} ${row.modelo}` : (row.tipo_veiculo || '-')}
                    {row.placa && <span style={{ display: 'block', fontSize: '0.8em', color: 'var(--text-muted)' }}>{row.placa}</span>}
                  </td>
                  <td>
                    <span className={`status-badge status-${row.status}`}>
                      {row.status === 'em_execucao' ? 'Em Execução' : row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{formatCurrency(row.valor_cobrado)}</td>
                  <td>{formatDuration(row.tempo_estimado_minutos)}</td>
                  <td>{formatDuration(row.tempo_real_minutos)}</td>
                  <td style={{ fontSize: '0.9em' }}>{formatDateTime(row.inicio_realizado_em)}</td>
                  <td style={{ fontSize: '0.9em' }}>{formatDateTime(row.fim_realizado_em)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicesReport;
