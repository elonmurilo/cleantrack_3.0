import { supabase } from '../lib/supabase';
import { 
  Appointment, 
  CreateAppointmentPayload, 
  UpdateAppointmentPayload,
  AppointmentStatus 
} from '../types/appointment';

export const appointmentService = {
  /**
   * Lista todos os agendamentos ativos, incluindo dados de cliente e veículo
   */
  listAppointments: async (): Promise<Appointment[]> => {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*, cliente:clientes(nome), veiculo:cliente_veiculos(modelo, marca, placa)')
      .eq('ativo', true)
      .order('inicio_agendado', { ascending: true });

    if (error) {
      console.error('Erro ao listar agendamentos:', error);
      throw error;
    }
    
    return data as Appointment[];
  },

  /**
   * Busca um agendamento por ID
   */
  getAppointmentById: async (id: string): Promise<Appointment> => {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*, cliente:clientes(nome), veiculo:cliente_veiculos(modelo, marca, placa)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Appointment;
  },

  /**
   * Cria um novo agendamento
   */
  createAppointment: async (payload: CreateAppointmentPayload): Promise<Appointment> => {
    const { data, error } = await supabase
      .from('agendamentos')
      .insert([payload])
      .select('*, cliente:clientes(nome), veiculo:cliente_veiculos(modelo, marca, placa)')
      .single();

    if (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
    
    return data as Appointment;
  },

  /**
   * Atualiza um agendamento existente
   */
  updateAppointment: async (id: string, payload: UpdateAppointmentPayload): Promise<Appointment> => {
    const { data, error } = await supabase
      .from('agendamentos')
      .update(payload)
      .eq('id', id)
      .select('*, cliente:clientes(nome), veiculo:cliente_veiculos(modelo, marca, placa)')
      .single();

    if (error) {
      console.error('Erro ao atualizar agendamento:', error);
      throw error;
    }
    
    return data as Appointment;
  },

  /**
   * Atualiza apenas o status de um agendamento
   */
  updateStatus: async (id: string, status: AppointmentStatus, userId: string): Promise<void> => {
    const { error } = await supabase
      .from('agendamentos')
      .update({ status, updated_by: userId })
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Cancelamento lógico (ativo = false e status = cancelado)
   */
  cancelAppointment: async (id: string, userId: string): Promise<void> => {
    const { error } = await supabase
      .from('agendamentos')
      .update({ 
        status: 'cancelado', 
        ativo: false, 
        updated_by: userId 
      })
      .eq('id', id);

    if (error) throw error;
  }
};
