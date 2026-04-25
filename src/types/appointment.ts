import { Cliente } from './client';

export type AppointmentStatus = 'agendado' | 'em_execucao' | 'finalizado' | 'cancelado';

export interface Appointment {
  id: string;
  cliente_id: string;
  veiculo_id?: string;
  titulo: string;
  descricao_servico?: string;
  inicio_agendado: string;
  fim_agendado?: string;
  tempo_estimado_minutos?: number;
  status: AppointmentStatus;
  observacoes?: string;
  ativo: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  
  // Joins / Related data
  cliente?: {
    nome: string;
  };
  veiculo?: {
    placa?: string;
    modelo?: string;
    marca?: string;
    tipo_veiculo?: 'carro' | 'moto';
  };
}

export interface CreateAppointmentPayload {
  cliente_id: string;
  veiculo_id?: string;
  titulo: string;
  descricao_servico?: string;
  inicio_agendado: string;
  fim_agendado?: string;
  tempo_estimado_minutos?: number;
  status?: AppointmentStatus;
  observacoes?: string;
  created_by: string;
  ativo?: boolean;
}

export interface UpdateAppointmentPayload {
  cliente_id?: string;
  veiculo_id?: string;
  titulo?: string;
  descricao_servico?: string;
  inicio_agendado?: string;
  fim_agendado?: string;
  tempo_estimado_minutos?: number;
  status?: AppointmentStatus;
  observacoes?: string;
  updated_by: string;
  ativo?: boolean;
}
