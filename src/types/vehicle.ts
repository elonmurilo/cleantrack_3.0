export interface ClientVehicle {
  id: string;
  cliente_id: string;
  marca: string;
  modelo: string;
  tipo_veiculo: 'carro' | 'moto';
  cor?: string;
  placa?: string;
  ano?: number;
  observacoes?: string;
  principal: boolean;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateVehiclePayload {
  cliente_id: string;
  marca: string;
  modelo: string;
  tipo_veiculo: 'carro' | 'moto';
  cor?: string;
  placa?: string;
  ano?: number;
  observacoes?: string;
  principal?: boolean;
  ativo?: boolean;
}

export interface UpdateVehiclePayload {
  marca?: string;
  modelo?: string;
  tipo_veiculo?: 'carro' | 'moto';
  cor?: string;
  placa?: string;
  ano?: number;
  observacoes?: string;
  principal?: boolean;
  ativo?: boolean;
}
