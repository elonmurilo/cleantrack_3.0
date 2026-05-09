import { supabase } from '../lib/supabase';
import { 
  ServiceRecord, 
  CreateServiceRecordPayload, 
  UpdateServiceRecordPayload,
  ServiceRecordStatus 
} from '../types/serviceRecord';

/**
 * Normaliza campos UUID opcionais no payload antes de enviar ao Supabase.
 * Converte strings vazias para null para evitar erro de UUID inválido no PostgreSQL.
 */
const normalizePayload = <T extends Record<string, any>>(payload: T): T => {
  const uuidOptionalFields = ['agendamento_id', 'veiculo_id'];
  const normalized: Record<string, any> = { ...payload };
  
  for (const field of uuidOptionalFields) {
    if (field in normalized && (!normalized[field] || (typeof normalized[field] === 'string' && normalized[field].trim() === ''))) {
      normalized[field] = null;
    }
  }
  
  return normalized as T;
};

export const serviceRecordService = {
  /**
   * Lista todos os serviços realizados ativos
   */
  listServiceRecords: async (): Promise<ServiceRecord[]> => {
    const { data, error } = await supabase
      .from('servicos_realizados')
      .select(`
        *,
        cliente:clientes(nome),
        veiculo:cliente_veiculos(marca, modelo, placa, tipo_veiculo)
      `)
      .eq('ativo', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao listar serviços realizados:', error);
      throw error;
    }
    
    return data as ServiceRecord[];
  },

  /**
   * Busca um serviço realizado por ID
   */
  getServiceRecordById: async (id: string): Promise<ServiceRecord> => {
    const { data, error } = await supabase
      .from('servicos_realizados')
      .select(`
        *,
        cliente:clientes(nome),
        veiculo:cliente_veiculos(marca, modelo, placa, tipo_veiculo)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as ServiceRecord;
  },

  /**
   * Cria um novo serviço realizado
   */
  createServiceRecord: async (payload: CreateServiceRecordPayload): Promise<ServiceRecord> => {
    const normalizedPayload = normalizePayload(payload);
    const { data, error } = await supabase
      .from('servicos_realizados')
      .insert([normalizedPayload])
      .select(`
        *,
        cliente:clientes(nome),
        veiculo:cliente_veiculos(marca, modelo, placa, tipo_veiculo)
      `)
      .single();

    if (error) {
      console.error('Erro ao criar serviço realizado:', error);
      throw error;
    }
    
    return data as ServiceRecord;
  },

  /**
   * Atualiza um serviço realizado existente
   */
  updateServiceRecord: async (id: string, payload: UpdateServiceRecordPayload): Promise<ServiceRecord> => {
    const normalizedPayload = normalizePayload(payload);
    const { data, error } = await supabase
      .from('servicos_realizados')
      .update(normalizedPayload)
      .eq('id', id)
      .select(`
        *,
        cliente:clientes(nome),
        veiculo:cliente_veiculos(marca, modelo, placa)
      `)
      .single();

    if (error) {
      console.error('Erro ao atualizar serviço realizado:', error);
      throw error;
    }
    
    return data as ServiceRecord;
  },

  /**
   * Atualiza apenas o status de um serviço realizado
   */
  updateStatus: async (id: string, status: ServiceRecordStatus, userId: string): Promise<void> => {
    const { error } = await supabase
      .from('servicos_realizados')
      .update({ status, updated_by: userId })
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Cancelamento lógico (ativo = false e status = cancelado)
   */
  cancelServiceRecord: async (id: string, userId: string): Promise<void> => {
    const { error } = await supabase
      .from('servicos_realizados')
      .update({ 
        status: 'cancelado', 
        ativo: false, 
        updated_by: userId 
      })
      .eq('id', id);

    if (error) throw error;
  }
};
