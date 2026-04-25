import { Cliente } from './client';
import { Appointment } from './appointment';
import { ServiceRecord } from './serviceRecord';
import { FinancialRecord } from './financial';

export interface DashboardStats {
  faturamentoMes: number;
  despesasMes: number;
  saldoMes: number;
  servicosConcluidosMes: number;
  agendamentosHoje: number;
  pendenciasFinanceiras: {
    valor: number;
    quantidade: number;
  };
}

export interface DashboardData {
  stats: DashboardStats;
  agendaHoje: Appointment[];
  servicosEmExecucao: ServiceRecord[];
  ultimosServicos: ServiceRecord[];
  ultimasMovimentacoes: FinancialRecord[];
  ultimosClientes: Cliente[];
}
