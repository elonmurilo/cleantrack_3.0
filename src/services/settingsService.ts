import { supabase } from '../lib/supabase';
import { SystemSettings, UpdateSystemSettingsPayload } from '../types/settings';

export const settingsService = {
  getSettings: async (): Promise<SystemSettings> => {
    // Busca a configuração ativa mais recente
    const { data, error } = await supabase
      .from('configuracoes_sistema')
      .select('*')
      .eq('ativo', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Nenhuma configuração encontrada. Criar uma padrão.
        return await settingsService.createDefaultSettings();
      }
      console.error('Erro ao buscar configurações:', error);
      throw error;
    }

    return data as SystemSettings;
  },

  createDefaultSettings: async (): Promise<SystemSettings> => {
    const defaultPayload = {
      nome_empresa: 'CleanTrack',
      telefone_empresa: null,
      email_empresa: null,
      horario_abertura: '08:00',
      horario_fechamento: '18:00',
      tempo_padrao_servico_minutos: 60,
      moeda: 'BRL',
      timezone: 'America/Sao_Paulo',
      permitir_agendamento_sem_veiculo: false,
      exigir_foto_antes_depois: false,
      ativo: true,
    };

    const { data, error } = await supabase
      .from('configuracoes_sistema')
      .insert(defaultPayload)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar configuração padrão:', error);
      throw error;
    }

    return data as SystemSettings;
  },

  updateSettings: async (id: string, payload: UpdateSystemSettingsPayload, userId: string): Promise<SystemSettings> => {
    const payloadWithUser = {
      ...payload,
      updated_by: userId
    };

    const { data, error } = await supabase
      .from('configuracoes_sistema')
      .update(payloadWithUser)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw error;
    }

    return data as SystemSettings;
  }
};
