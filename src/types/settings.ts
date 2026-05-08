export interface SystemSettings {
  id: string;
  nome_empresa: string;
  telefone_empresa: string | null;
  email_empresa: string | null;
  horario_abertura: string;
  horario_fechamento: string;
  tempo_padrao_servico_minutos: number;
  moeda: string;
  timezone: string;
  permitir_agendamento_sem_veiculo: boolean;
  exigir_foto_antes_depois: boolean;
  ativo: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateSystemSettingsPayload {
  nome_empresa?: string;
  telefone_empresa?: string | null;
  email_empresa?: string | null;
  horario_abertura?: string;
  horario_fechamento?: string;
  tempo_padrao_servico_minutos?: number;
  moeda?: string;
  timezone?: string;
  permitir_agendamento_sem_veiculo?: boolean;
  exigir_foto_antes_depois?: boolean;
  updated_by?: string;
}
