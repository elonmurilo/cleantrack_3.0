export type FinancialType = 'entrada' | 'saida';
export type FinancialStatus = 'pendente' | 'pago' | 'cancelado';
export type PaymentMethod = 'dinheiro' | 'pix' | 'cartao_debito' | 'cartao_credito' | 'transferencia' | 'outro';

export interface FinancialRecord {
  id: string;
  tipo: FinancialType;
  status: FinancialStatus;
  descricao: string;
  categoria: string;
  valor: number;
  data_competencia: string;
  data_pagamento: string | null;
  forma_pagamento: PaymentMethod | null;
  servico_realizado_id: string | null;
  cliente_id: string | null;
  observacoes: string | null;
  ativo: boolean;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  
  // Relacionamentos carregados
  cliente?: {
    id: string;
    nome: string;
  };
  servico_realizado?: {
    id: string;
    titulo: string;
  };
}

export interface CreateFinancialPayload {
  tipo: FinancialType;
  status: FinancialStatus;
  descricao: string;
  categoria: string;
  valor: number;
  data_competencia: string;
  data_pagamento?: string | null;
  forma_pagamento?: PaymentMethod | null;
  servico_realizado_id?: string | null;
  cliente_id?: string | null;
  observacoes?: string | null;
  created_by: string;
}

export interface UpdateFinancialPayload {
  tipo?: FinancialType;
  status?: FinancialStatus;
  descricao?: string;
  categoria?: string;
  valor?: number;
  data_competencia?: string;
  data_pagamento?: string | null;
  forma_pagamento?: PaymentMethod | null;
  servico_realizado_id?: string | null;
  cliente_id?: string | null;
  observacoes?: string | null;
  updated_by: string;
  ativo?: boolean;
}

export interface FinancialSummaryData {
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
  pendencias: number;
}
