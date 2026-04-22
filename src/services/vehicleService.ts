import { supabase } from '../lib/supabase';
import { ClientVehicle, CreateVehiclePayload, UpdateVehiclePayload } from '../types/vehicle';

export const vehicleService = {
  /**
   * Lista veículos de um cliente específico
   */
  listVehiclesByClient: async (clienteId: string): Promise<ClientVehicle[]> => {
    const { data, error } = await supabase
      .from('cliente_veiculos')
      .select('*')
      .eq('cliente_id', clienteId)
      .eq('ativo', true)
      .order('principal', { ascending: false });

    if (error) throw error;
    return data as ClientVehicle[];
  },

  /**
   * Busca um veículo por ID
   */
  getVehicleById: async (id: string): Promise<ClientVehicle> => {
    const { data, error } = await supabase
      .from('cliente_veiculos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as ClientVehicle;
  },

  /**
   * Cria um novo veículo
   */
  createVehicle: async (payload: CreateVehiclePayload): Promise<ClientVehicle> => {
    // Se for marcado como principal, precisamos garantir que os outros não sejam
    if (payload.principal) {
      await vehicleService.clearPrincipals(payload.cliente_id);
    }

    const { data, error } = await supabase
      .from('cliente_veiculos')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data as ClientVehicle;
  },

  /**
   * Atualiza dados de um veículo
   */
  updateVehicle: async (id: string, payload: UpdateVehiclePayload, clienteId?: string): Promise<ClientVehicle> => {
    // Se estiver sendo definido como principal, removemos o principal dos outros
    if (payload.principal && clienteId) {
      await vehicleService.clearPrincipals(clienteId);
    }

    const { data, error } = await supabase
      .from('cliente_veiculos')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ClientVehicle;
  },

  /**
   * Desativação lógica (ativo = false)
   */
  deactivateVehicle: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('cliente_veiculos')
      .update({ ativo: false })
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Define um veículo como principal e remove dos outros
   */
  setPrincipal: async (id: string, clienteId: string): Promise<void> => {
    // 1. Remove principal de todos os veículos ativos do cliente
    await vehicleService.clearPrincipals(clienteId);

    // 2. Define o veículo alvo como principal
    const { error } = await supabase
      .from('cliente_veiculos')
      .update({ principal: true })
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Remove a marca de principal de todos os veículos ativos de um cliente
   */
  clearPrincipals: async (clienteId: string): Promise<void> => {
    const { error } = await supabase
      .from('cliente_veiculos')
      .update({ principal: false })
      .eq('cliente_id', clienteId)
      .eq('ativo', true);

    if (error) throw error;
  }
};
