export interface FinancialReportRow {
  id: string;
  tipo: 'entrada' | 'saida';
  status: 'pendente' | 'pago' | 'cancelado' | 'atrasado';
  descricao: string;
  categoria: string;
  valor: number;
  data_competencia: string;
  data_pagamento: string | null;
  forma_pagamento: string | null;
  ativo: boolean;
  cliente_id: string | null;
  cliente_nome: string | null;
  servico_realizado_id: string | null;
  servico_titulo: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServicesReportRow {
  id: string;
  titulo: string;
  descricao_servico: string;
  status: 'aberto' | 'em_execucao' | 'concluido' | 'cancelado';
  valor_cobrado: number;
  tempo_estimado_minutos: number | null;
  tempo_real_minutos: number | null;
  inicio_realizado_em: string | null;
  fim_realizado_em: string | null;
  ativo: boolean;
  cliente_id: string;
  cliente_nome: string;
  veiculo_id: string | null;
  tipo_veiculo: string | null;
  marca: string | null;
  modelo: string | null;
  placa: string | null;
  agendamento_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientsReportRow {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  total_veiculos: number;
  total_servicos: number;
  total_servicos_concluidos: number;
  valor_total_servicos: number;
  ultimo_servico_em: string | null;
}

export interface ProductivityReportRow {
  id: string;
  titulo: string;
  status: string;
  cliente_id: string;
  cliente_nome: string;
  veiculo_id: string | null;
  tipo_veiculo: string | null;
  marca: string | null;
  modelo: string | null;
  placa: string | null;
  tempo_estimado_minutos: number | null;
  tempo_real_minutos: number | null;
  diferenca_tempo_minutos: number | null;
  inicio_realizado_em: string | null;
  fim_realizado_em: string | null;
  created_at: string;
  updated_at: string;
  data_referencia: string | null;
}

export interface ReportFilters {
  startDate: string;
  endDate: string;
  status: string;
  type: string;
  searchTerm: string;
}
