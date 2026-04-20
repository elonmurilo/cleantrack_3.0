export interface Cliente {
  id: string; // UUID no Supabase
  nome: string;
  telefone: string;
  email?: string;
  observacoes?: string;
  ativo: boolean;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateClientePayload {
  nome: string;
  telefone: string;
  email?: string;
  observacoes?: string;
  created_by: string;
}

export interface UpdateClientePayload {
  nome?: string;
  telefone?: string;
  email?: string;
  observacoes?: string;
  ativo?: boolean;
  updated_by: string;
}
