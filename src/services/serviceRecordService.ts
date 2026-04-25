import { supabase } from '../lib/supabase';
import { 
  ServiceRecord, 
  CreateServiceRecordPayload, 
  UpdateServiceRecordPayload,
  ServiceRecordStatus 
} from '../types/serviceRecord';

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
    const { data, error } = await supabase
      .from('servicos_realizados')
      .insert([payload])
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
    const { data, error } = await supabase
      .from('servicos_realizados')
      .update(payload)
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
