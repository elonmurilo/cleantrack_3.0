import { supabase } from '../lib/supabase';
import { 
  FinancialRecord, 
  CreateFinancialPayload, 
  UpdateFinancialPayload,
  FinancialSummaryData 
} from '../types/financial';
import { Summary } from '../types';

export const financialService = {
  /**
   * Lista todas as movimentações ativas
   */
  listRecords: async (): Promise<FinancialRecord[]> => {
    const { data, error } = await supabase
      .from('movimentacoes_financeiras')
      .select(`
        *,
        cliente:clientes(id, nome),
        servico_realizado:servicos_realizados(id, titulo)
      `)
      .eq('ativo', true)
      .order('data_competencia', { ascending: false });

    if (error) throw error;
    return data as FinancialRecord[];
  },

  /**
   * Busca uma movimentação por ID
   */
  getRecordById: async (id: string): Promise<FinancialRecord> => {
    const { data, error } = await supabase
      .from('movimentacoes_financeiras')
      .select(`
        *,
        cliente:clientes(id, nome),
        servico_realizado:servicos_realizados(id, titulo)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as FinancialRecord;
  },

  /**
   * Cria uma nova movimentação
   */
  createRecord: async (payload: CreateFinancialPayload): Promise<FinancialRecord> => {
    const { data, error } = await supabase
      .from('movimentacoes_financeiras')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data as FinancialRecord;
  },

  /**
   * Atualiza uma movimentação
   */
  updateRecord: async (id: string, payload: UpdateFinancialPayload): Promise<FinancialRecord> => {
    const { data, error } = await supabase
      .from('movimentacoes_financeiras')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as FinancialRecord;
  },

  /**
   * Altera o status de uma movimentação
   */
  updateStatus: async (id: string, status: 'pendente' | 'pago' | 'cancelado', userId: string, paymentData?: { data_pagamento?: string, forma_pagamento?: string }): Promise<void> => {
    const { error } = await supabase
      .from('movimentacoes_financeiras')
      .update({ 
        status, 
        updated_by: userId,
        ...paymentData
      })
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Desativação lógica (ativo = false)
   */
  deactivateRecord: async (id: string, userId: string): Promise<void> => {
    const { error } = await supabase
      .from('movimentacoes_financeiras')
      .update({ ativo: false, updated_by: userId })
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Obtém resumo financeiro detalhado (para a página financeira)
   */
  getFinancialSummary: async (): Promise<FinancialSummaryData> => {
    const { data, error } = await supabase
      .from('movimentacoes_financeiras')
      .select('tipo, status, valor')
      .eq('ativo', true);

    if (error) throw error;

    const summary: FinancialSummaryData = {
      totalEntradas: 0,
      totalSaidas: 0,
      saldo: 0,
      pendencias: 0
    };

    data.forEach(item => {
      if (item.status === 'pago') {
        if (item.tipo === 'entrada') {
          summary.totalEntradas += item.valor;
        } else {
          summary.totalSaidas += item.valor;
        }
      } else if (item.status === 'pendente') {
        summary.pendencias += item.valor;
      }
    });

    summary.saldo = summary.totalEntradas - summary.totalSaidas;

    return summary;
  },

  /**
   * Obtém resumo geral (para Dashboard e Clientes)
   * Restaura o tipo 'Summary' original para compatibilidade
   */
  getSummary: async (): Promise<Summary> => {
    // Para manter a compatibilidade e não quebrar outras telas, 
    // buscamos os dados reais onde possível e usamos valores mockados para o resto (como crescimento)
    
    try {
      const [clientsCount, servicesToday, financial] = await Promise.all([
        supabase.from('clientes').select('*', { count: 'exact', head: true }).eq('ativo', true),
        supabase.from('servicos_realizados').select('*', { count: 'exact', head: true }).eq('ativo', true).gte('created_at', new Date().toISOString().split('T')[0]),
        financialService.getFinancialSummary()
      ]);

      return {
        totalClients: { value: clientsCount.count || 0, growth: '+12% este mês' },
        servicesToday: { value: servicesToday.count || 0, status: 'Em andamento' },
        monthlyBilling: { 
          value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(financial.totalEntradas), 
          growth: '+8% vs mês ant.' 
        },
        lastMonthBilling: { value: 'R$ 12.450,00', growth: '+15%' } // Mockado por simplicidade agora
      };
    } catch (e) {
      // Fallback em caso de erro para não quebrar a tela
      return {
        totalClients: { value: 0, growth: '0%' },
        servicesToday: { value: 0, status: 'Nenhum' },
        monthlyBilling: { value: 'R$ 0,00', growth: '0%' },
        lastMonthBilling: { value: 'R$ 0,00', growth: '0%' }
      };
    }
  }
};
