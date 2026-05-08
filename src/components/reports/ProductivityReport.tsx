import React, { useMemo } from 'react';
import { Target, CheckCircle, Clock, Zap, Percent } from 'lucide-react';
import { ProductivityReportRow } from '../../types/reports';
import ReportSummaryCard from './ReportSummaryCard';

interface ProductivityReportProps {
  data: ProductivityReportRow[];
}

const ProductivityReport: React.FC<ProductivityReportProps> = ({ data }) => {
  const stats = useMemo(() => {
    return data.reduce((acc, row) => {
      acc.total_servicos++;
      
      if (row.status === 'concluido') acc.concluidos++;
      
      if (row.tempo_real_minutos !== null) {
        acc.soma_tempo_real += row.tempo_real_minutos;
        acc.qtd_com_tempo_real++;
      }

      if (row.diferenca_tempo_minutos !== null) {
        acc.soma_diferenca += row.diferenca_tempo_minutos;
        acc.qtd_com_diferenca++;
      }
      
      return acc;
    }, {
      total_servicos: 0,
      concluidos: 0,
      soma_tempo_real: 0,
      qtd_com_tempo_real: 0,
      soma_diferenca: 0,
      qtd_com_diferenca: 0
    });
  }, [data]);

  const tempoMedio = stats.qtd_com_tempo_real > 0 
    ? Math.round(stats.soma_tempo_real / stats.qtd_com_tempo_real) 
    : 0;

  const diferencaMedia = stats.qtd_com_diferenca > 0
    ? Math.round(stats.soma_diferenca / stats.qtd_com_diferenca)
    : 0;

  const taxaConclusao = stats.total_servicos > 0
    ? Math.round((stats.concluidos / stats.total_servicos) * 100)
    : 0;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  const formatDuration = (minutes: number | null) => {
    if (minutes === null || minutes === undefined) return '-';
    const isNegative = minutes < 0;
    const absMinutes = Math.abs(minutes);
    
    let formatted = '';
    if (absMinutes < 60) formatted = `${absMinutes}m`;
    else {
      const h = Math.floor(absMinutes / 60);
      const m = absMinutes % 60;
      formatted = m > 0 ? `${h}h ${m}m` : `${h}h`;
    }

    return isNegative ? `-${formatted}` : formatted;
  };

  const getDiffColor = (diff: number | null) => {
    if (diff === null) return 'inherit';
    if (diff > 0) return 'var(--danger-color)'; // Atraso (tempo real > estimado)
    if (diff < 0) return 'var(--success-color)'; // Adiantado (tempo real < estimado)
    return 'var(--text-muted)'; // No prazo
  };

  return (
    <div className="report-container">
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <ReportSummaryCard 
          title="Total de Serviços (Ref)" 
          value={stats.total_servicos} 
          icon={<Target />} 
          color="primary" 
        />
        <ReportSummaryCard 
          title="Taxa de Conclusão" 
          value={`${taxaConclusao}%`} 
          icon={<Percent />} 
          color={taxaConclusao >= 80 ? 'success' : 'warning'} 
        />
        <ReportSummaryCard 
          title="Tempo Médio Real" 
          value={formatDuration(tempoMedio)} 
          icon={<Clock />} 
          color="info" 
        />
        <ReportSummaryCard 
          title="Diferença Média" 
          value={formatDuration(diferencaMedia)} 
          subtitle={diferencaMedia > 0 ? 'Atraso médio' : (diferencaMedia < 0 ? 'Adiantamento médio' : 'No prazo')}
          icon={<Zap />} 
          color={diferencaMedia <= 0 ? 'success' : 'danger'} 
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Data Ref.</th>
              <th>Serviço</th>
              <th>Cliente</th>
              <th>Status</th>
              <th>T. Estimado</th>
              <th>T. Real</th>
              <th style={{ textAlign: 'center' }}>Diferença</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Nenhum dado de produtividade encontrado para os filtros atuais.</td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontSize: '0.9em' }}>{formatDate(row.data_referencia)}</td>
                  <td style={{ fontWeight: 500 }}>{row.titulo}</td>
                  <td>
                    <div>{row.cliente_nome}</div>
                    <div style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
                      {row.marca && row.modelo ? `${row.marca} ${row.modelo}` : (row.tipo_veiculo || '')}
                      {row.placa && ` - ${row.placa}`}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${row.status}`}>
                      {row.status === 'em_execucao' ? 'Em Execução' : row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </span>
                  </td>
                  <td>{formatDuration(row.tempo_estimado_minutos)}</td>
                  <td>{formatDuration(row.tempo_real_minutos)}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600, color: getDiffColor(row.diferenca_tempo_minutos) }}>
                    {formatDuration(row.diferenca_tempo_minutos)}
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

export default ProductivityReport;
