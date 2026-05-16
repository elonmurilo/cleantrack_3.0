import { supabase } from '../lib/supabase';
import {
  MonitoringEventRow,
  CreateSensorEventPayload,
  SensorEvent
} from '../types/monitoring';

export const monitoringService = {
  async fetchMonitoringEvents(): Promise<MonitoringEventRow[]> {
    const { data, error } = await supabase
      .from('vw_monitoramento_eventos')
      .select('*')
      .order('registrado_em', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data as MonitoringEventRow[];
  },

  async fetchActiveServices(): Promise<{ id: string; titulo: string; cliente: string; placa: string; status: string }[]> {
    // Busca serviços em aberto ou em_execucao, mais as colunas associadas para exibição
    const { data, error } = await supabase
      .from('servicos_realizados')
      .select(`
        id,
        titulo,
        status,
        cliente:clientes(nome),
        veiculo:cliente_veiculos(placa)
      `)
      .in('status', ['aberto', 'em_execucao'])
      .eq('ativo', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar serviços ativos (Supabase):', error);
      throw error;
    }

    console.log(`fetchActiveServices carregou ${data?.length || 0} serviços.`);
    
    return data.map((s: any) => ({
      id: s.id,
      titulo: s.titulo,
      cliente: s.cliente?.nome || 'N/A',
      placa: s.veiculo?.placa || 'N/A',
      status: s.status,
    }));
  },

  async createSensorEvent(payload: CreateSensorEventPayload): Promise<SensorEvent> {
    // 1. Inserir o evento simulado
    const { data: eventData, error: eventError } = await supabase
      .from('sensor_eventos')
      .insert({
        servico_realizado_id: payload.servico_realizado_id,
        tipo_evento: payload.tipo_evento,
        origem: payload.origem,
        descricao: payload.descricao || null,
        valor: payload.valor || null,
        created_by: payload.created_by
      })
      .select()
      .single();

    if (eventError) {
      throw new Error(`Falha ao registrar evento: ${eventError.message}`);
    }

    // 2. Tentar atualizar o serviço com base no tipo de evento
    try {
      // Buscar o estado atual do serviço para evitar sobrescrever datas e verificar status
      const { data: serviceData, error: serviceError } = await supabase
        .from('servicos_realizados')
        .select('status, inicio_realizado_em, fim_realizado_em')
        .eq('id', payload.servico_realizado_id)
        .single();

      if (serviceError) throw serviceError;

      let updatePayload: any = null;

      if (payload.tipo_evento === 'servico_finalizado') {
        if (serviceData.status !== 'concluido' && serviceData.status !== 'cancelado') {
          updatePayload = {
            status: 'concluido',
            updated_by: payload.created_by,
            ...( !serviceData.fim_realizado_em && { fim_realizado_em: new Date().toISOString() } )
          };
        } else {
          console.warn('Tentativa de finalizar serviço que já estava concluído ou cancelado ignorada.');
        }
      } else if (payload.tipo_evento === 'lavagem_iniciada' || payload.tipo_evento === 'entrada_detectada') {
        if (serviceData.status === 'aberto') {
          updatePayload = {
            status: 'em_execucao',
            updated_by: payload.created_by,
            ...( !serviceData.inicio_realizado_em && { inicio_realizado_em: new Date().toISOString() } )
          };
        }
      }

      if (updatePayload) {
        const { error: updateError } = await supabase
          .from('servicos_realizados')
          .update(updatePayload)
          .eq('id', payload.servico_realizado_id);

        if (updateError) {
          throw new Error(`Evento registrado, mas falhou ao atualizar o serviço: ${updateError.message}`);
        }
      }

    } catch (err: any) {
      // Erro na fase de atualização do serviço
      console.error('Erro na sincronização de status do serviço:', err);
      // Jogar o erro para cima para que a UI notifique o usuário e recarregue
      throw new Error(`Evento registrado, mas ocorreu um erro na atualização do serviço: ${err.message}`);
    }

    return eventData as SensorEvent;
  }
};
