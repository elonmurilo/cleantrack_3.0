import { supabase } from '../lib/supabase';
import { 
  FinancialReportRow, 
  ServicesReportRow, 
  ClientsReportRow, 
  ProductivityReportRow, 
  ReportFilters 
} from '../types/reports';

export const reportsService = {
  getFinancialReport: async (filters: ReportFilters): Promise<FinancialReportRow[]> => {
    let query = supabase.from('vw_relatorio_financeiro').select('*');

    if (filters.startDate) {
      query = query.gte('data_competencia', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('data_competencia', filters.endDate);
    }
    if (filters.status && filters.status !== 'todos') {
      query = query.eq('status', filters.status);
    }
    if (filters.type && filters.type !== 'todos') {
      query = query.eq('tipo', filters.type);
    }

    // Default sorting
    query = query.order('data_competencia', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data as FinancialReportRow[];
  },

  getServicesReport: async (filters: ReportFilters): Promise<ServicesReportRow[]> => {
    let query = supabase.from('vw_relatorio_servicos').select('*');

    if (filters.startDate) {
      // Usando created_at como base para filtros de serviços se não houver campo melhor
      query = query.gte('created_at', `${filters.startDate}T00:00:00`);
    }
    if (filters.endDate) {
      query = query.lte('created_at', `${filters.endDate}T23:59:59`);
    }
    if (filters.status && filters.status !== 'todos') {
      query = query.eq('status', filters.status);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data as ServicesReportRow[];
  },

  getClientsReport: async (filters: ReportFilters): Promise<ClientsReportRow[]> => {
    let query = supabase.from('vw_relatorio_clientes').select('*');

    if (filters.searchTerm) {
      // A view tem nome, telefone, email
      query = query.or(`nome.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%,telefone.ilike.%${filters.searchTerm}%`);
    }
    
    // Filtro de data para clientes pode ser com base no created_at do cliente
    if (filters.startDate) {
      query = query.gte('created_at', `${filters.startDate}T00:00:00`);
    }
    if (filters.endDate) {
      query = query.lte('created_at', `${filters.endDate}T23:59:59`);
    }

    query = query.order('nome', { ascending: true });

    const { data, error } = await query;
    if (error) throw error;
    return data as ClientsReportRow[];
  },

  getProductivityReport: async (filters: ReportFilters): Promise<ProductivityReportRow[]> => {
    let query = supabase.from('vw_relatorio_produtividade').select('*');

    if (filters.startDate) {
      query = query.gte('data_referencia', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('data_referencia', filters.endDate);
    }
    if (filters.status && filters.status !== 'todos') {
      query = query.eq('status', filters.status);
    }

    query = query.order('data_referencia', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data as ProductivityReportRow[];
  }
};
