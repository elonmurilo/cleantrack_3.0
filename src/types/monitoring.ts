export type SensorEventType =
  | 'entrada_detectada'
  | 'lavagem_iniciada'
  | 'lavagem_finalizada'
  | 'acabamento_iniciado'
  | 'acabamento_finalizado'
  | 'servico_finalizado'
  | 'alerta_atraso'
  | 'alerta_tempo_excedido';

export const EVENT_TYPE_LABELS: Record<SensorEventType, string> = {
  entrada_detectada: 'Entrada detectada',
  lavagem_iniciada: 'Lavagem iniciada',
  lavagem_finalizada: 'Lavagem finalizada',
  acabamento_iniciado: 'Acabamento iniciado',
  acabamento_finalizado: 'Acabamento finalizado',
  servico_finalizado: 'Serviço finalizado',
  alerta_atraso: 'Alerta de atraso',
  alerta_tempo_excedido: 'Alerta de tempo excedido',
};

export interface SensorEvent {
  id: string;
  servico_realizado_id: string;
  tipo_evento: SensorEventType;
  origem: string;
  descricao?: string | null;
  valor?: string | null;
  registrado_em: string;
  ativo: boolean;
  created_by: string;
  created_at: string;
}

export interface MonitoringEventRow extends SensorEvent {
  // Campos vindos da view vw_monitoramento_eventos
  servico_titulo: string;
  servico_status: string;
  tempo_estimado_minutos: number;
  tempo_real_minutos?: number | null;
  inicio_realizado_em?: string | null;
  fim_realizado_em?: string | null;
  cliente_id: string;
  cliente_nome: string;
  veiculo_id?: string | null;
  tipo_veiculo?: string | null;
  marca?: string | null;
  modelo?: string | null;
  placa?: string | null;
}

export interface CreateSensorEventPayload {
  servico_realizado_id: string;
  tipo_evento: SensorEventType;
  origem: string;
  descricao?: string;
  valor?: string;
  created_by: string;
}

export interface MonitoringSummary {
  eventosHoje: number;
  servicosEmExecucao: number;
  alertasAtivos: number;
  servicosFinalizadosSensor: number;
}
