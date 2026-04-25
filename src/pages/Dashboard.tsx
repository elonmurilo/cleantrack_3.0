import React, { useEffect, useState } from 'react';
import { 
  Users, 
  CalendarCheck, 
  DollarSign, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  PlayCircle
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import { dashboardService } from '../services/dashboardService';
import { DashboardData } from '../types/dashboard';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const result = await dashboardService.getDashboardData();
        setData(result);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
        setError("Não foi possível carregar os dados do painel.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="flex flex-col items-center">
          <div className="spinner"></div>
          <span>Carregando painel real...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="loading-container">
        <div className="text-red-500 flex flex-col items-center" style={{ textAlign: 'center' }}>
          <AlertCircle size={48} className="mb-2" />
          <span>{error || "Erro ao carregar dados."}</span>
          <Button variant="secondary" className="mt-4" onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  const { stats } = data;

  return (
    <>
      {/* Indicadores Principais */}
      <div className="dashboard-grid">
        <StatCard 
          label="Faturamento (Mês)"
          value={formatCurrency(stats.faturamentoMes)}
          subtext="Entradas pagas"
          subtextType="status"
          icon={<TrendingUp size={20} />}
          iconClass="icon-billing"
        />
        <StatCard 
          label="Despesas (Mês)"
          value={formatCurrency(stats.despesasMes)}
          subtext="Saídas pagas"
          subtextType="status"
          icon={<TrendingDown size={20} />}
          iconClass="icon-cancelado"
        />
        <StatCard 
          label="Saldo (Mês)"
          value={formatCurrency(stats.saldoMes)}
          subtext="Resultado mensal"
          subtextType="growth"
          icon={<DollarSign size={20} />}
          iconClass="icon-services"
        />
        <StatCard 
          label="Serviços Concluídos"
          value={stats.servicosConcluidosMes}
          subtext="Este mês"
          subtextType="status"
          icon={<CheckCircle2 size={20} />}
          iconClass="icon-clients"
        />
        <StatCard 
          label="Agendamentos Hoje"
          value={stats.agendamentosHoje}
          subtext="Para hoje"
          subtextType="status"
          icon={<CalendarCheck size={20} />}
          iconClass="icon-services"
        />
        <StatCard 
          label="Pendências"
          value={formatCurrency(stats.pendenciasFinanceiras.valor)}
          subtext={`${stats.pendenciasFinanceiras.quantidade} pendentes`}
          subtextType="status"
          icon={<AlertCircle size={20} />}
          iconClass="icon-billing"
        />
      </div>

      <div className="list-grid mt-6">
        {/* Agenda de Hoje */}
        <div>
          <h3 className="section-title">Agenda de Hoje</h3>
          <div className="list-container">
            {data.agendaHoje.length === 0 ? (
              <p className="item-subtext p-4">Nenhum agendamento para hoje.</p>
            ) : (
              data.agendaHoje.map(appointment => (
                <div key={appointment.id} className="list-item">
                  <div className="avatar" style={{ backgroundColor: '#E1F3FF', color: '#007AFF' }}>
                    <Clock size={20} />
                  </div>
                  <div className="item-details">
                    <span className="item-name">{appointment.titulo}</span>
                    <span className="item-subtext">{appointment.cliente?.nome} • {formatTime(appointment.inicio_agendado)}</span>
                    <span className={`status-badge status-${appointment.status} mt-1 text-xs`}>
                      {appointment.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Serviços em Execução */}
        <div>
          <h3 className="section-title">Serviços em Execução</h3>
          <div className="list-container">
            {data.servicosEmExecucao.length === 0 ? (
              <p className="item-subtext p-4">Nenhum serviço em execução.</p>
            ) : (
              data.servicosEmExecucao.map(service => (
                <div key={service.id} className="list-item">
                  <div className="avatar" style={{ backgroundColor: '#FDEBD0', color: '#EBB43F' }}>
                    <PlayCircle size={20} />
                  </div>
                  <div className="item-details">
                    <span className="item-name">{service.titulo}</span>
                    <span className="item-subtext">{service.cliente?.nome}</span>
                    <span className="item-subtext text-xs">
                      {service.veiculo ? `${service.veiculo.marca} ${service.veiculo.modelo} (${service.veiculo.placa})` : 'Sem veículo'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Últimos Clientes */}
        <div>
          <h3 className="section-title">Últimos Clientes</h3>
          <div className="list-container">
            {data.ultimosClientes.length === 0 ? (
              <p className="item-subtext p-4">Nenhum cliente cadastrado.</p>
            ) : (
              data.ultimosClientes.map(client => (
                <div key={client.id} className="list-item">
                  <Avatar initials={getInitials(client.nome)} color="#EBB43F" />
                  <div className="item-details">
                    <span className="item-name">{client.nome}</span>
                    <span className="item-subtext">{client.telefone}</span>
                    <span className="item-subtext text-xs">Cadastrado em: {formatDate(client.created_at)}</span>
                  </div>
                  <Button variant="action" size="sm">
                    <ChevronRight size={14} />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="list-grid">
        {/* Últimos Serviços Realizados */}
        <div>
          <h3 className="section-title">Últimos Serviços Realizados</h3>
          <div className="list-container">
            {data.ultimosServicos.length === 0 ? (
              <p className="item-subtext p-4">Nenhum serviço realizado ainda.</p>
            ) : (
              data.ultimosServicos.map(service => (
                <div key={service.id} className="list-item">
                  <div className="item-details">
                    <span className="item-name">{service.titulo}</span>
                    <span className="item-subtext">{service.cliente?.nome}</span>
                    <div className="flex justify-between items-center mt-1">
                      <span className={`status-badge status-${service.status} text-xs`}>
                        {service.status}
                      </span>
                      <span className="font-bold text-sm">{formatCurrency(service.valor_cobrado)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Últimas Movimentações Financeiras */}
        <div className="span-two">
          <h3 className="section-title">Últimas Movimentações Financeiras</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.ultimasMovimentacoes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-4 item-subtext">Nenhuma movimentação.</td>
                  </tr>
                ) : (
                  data.ultimasMovimentacoes.map(mov => (
                    <tr key={mov.id}>
                      <td>{formatDate(mov.data_competencia)}</td>
                      <td>{mov.descricao}</td>
                      <td>
                        <span className={mov.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'} style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                          {mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                        </span>
                      </td>
                      <td className="font-bold">{formatCurrency(mov.valor)}</td>
                      <td>
                        <span className={`status-badge status-${mov.status} text-xs`}>
                          {mov.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .span-two {
          grid-column: span 1;
        }
        @media (min-width: 1024px) {
          .span-two {
            grid-column: span 2;
          }
        }
      `}</style>
    </>
  );
};

export default Dashboard;
