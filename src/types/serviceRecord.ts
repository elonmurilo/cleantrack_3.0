export type ServiceRecordStatus = 'aberto' | 'em_execucao' | 'concluido' | 'cancelado';

export interface ServiceRecord {
  id: string;
  agendamento_id?: string;
  cliente_id: string;
  veiculo_id?: string;
  titulo: string;
  descricao_servico?: string;
  status: ServiceRecordStatus;
  valor_cobrado: number;
  tempo_estimado_minutos: number;
  tempo_real_minutos?: number;
  inicio_realizado_em?: string;
  fim_realizado_em?: string;
  observacoes?: string;
  ativo: boolean;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  
  // Joins
  cliente?: {
    nome: string;
  };
  veiculo?: {
    marca: string;
    modelo: string;
    placa: string;
  };
}

export interface CreateServiceRecordPayload {
  agendamento_id?: string;
  cliente_id: string;
  veiculo_id?: string;
  titulo: string;
  descricao_servico?: string;
  status: ServiceRecordStatus;
  valor_cobrado: number;
  tempo_estimado_minutos: number;
  tempo_real_minutos?: number;
  inicio_realizado_em?: string;
  fim_realizado_em?: string;
  observacoes?: string;
  ativo?: boolean;
  created_by: string;
}

export interface UpdateServiceRecordPayload {
  agendamento_id?: string;
  cliente_id?: string;
  veiculo_id?: string;
  titulo?: string;
  descricao_servico?: string;
  status?: ServiceRecordStatus;
  valor_cobrado?: number;
  tempo_estimado_minutos?: number;
  tempo_real_minutos?: number;
  inicio_realizado_em?: string;
  fim_realizado_em?: string;
  observacoes?: string;
  ativo?: boolean;
  updated_by: string;
}
