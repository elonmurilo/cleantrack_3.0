import { supabase } from '../lib/supabase';
import { Cliente, CreateClientePayload, UpdateClientePayload } from '../types/client';

export const clientService = {
  /**
   * Lista todos os clientes ativos
   */
  listClients: async (): Promise<Cliente[]> => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('ativo', true)
      .order('nome', { ascending: true });

    if (error) throw error;
    return data as Cliente[];
  },

  /**
   * Lista os clientes ativos mais recentes
   */
  getRecentClients: async (limit: number = 3): Promise<Cliente[]> => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('ativo', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Cliente[];
  },

  /**
   * Busca um cliente por ID
   */
  getClientById: async (id: string): Promise<Cliente> => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Cliente;
  },

  /**
   * Cria um novo cliente
   */
  createClient: async (payload: CreateClientePayload): Promise<Cliente> => {
    const { data, error } = await supabase
      .from('clientes')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data as Cliente;
  },

  /**
   * Atualiza dados de um cliente
   */
  updateClient: async (id: string, payload: UpdateClientePayload): Promise<Cliente> => {
    const { data, error } = await supabase
      .from('clientes')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Cliente;
  },

  /**
   * Desativação lógica (ativo = false)
   */
  deactivateClient: async (id: string, userId: string): Promise<void> => {
    const { error } = await supabase
      .from('clientes')
      .update({ ativo: false, updated_by: userId })
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Pesquisa simplificada
   */
  searchClients: async (query: string): Promise<Cliente[]> => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('ativo', true)
      .or(`nome.ilike.%${query}%,telefone.ilike.%${query}%`)
      .order('nome', { ascending: true });

    if (error) throw error;
    return data as Cliente[];
  }
};
