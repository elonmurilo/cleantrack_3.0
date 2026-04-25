import { supabase } from '../lib/supabase';
import { DashboardData, DashboardStats } from '../types/dashboard';

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    const now = new Date();
    
    // Boundaries for the current month
    const firstDayMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    
    // Boundaries for today
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const firstDayMonthISO = firstDayMonth.toISOString();
    const lastDayMonthISO = lastDayMonth.toISOString();
    const startOfTodayISO = startOfToday.toISOString();
    const endOfTodayISO = endOfToday.toISOString();

    // 1. Fetch Financial Stats for the month
    // We use data_competencia for month filtering
    const { data: monthlyFinancials, error: financialError } = await supabase
      .from('movimentacoes_financeiras')
      .select('tipo, status, valor, data_competencia')
      .eq('ativo', true)
      .gte('data_competencia', firstDayMonthISO.split('T')[0])
      .lte('data_competencia', lastDayMonthISO.split('T')[0]);

    if (financialError) throw financialError;

    // 2. Fetch Pending Financial items (total accumulated)
    const { data: pendingFinancials, error: pendingError } = await supabase
      .from('movimentacoes_financeiras')
      .select('valor')
      .eq('ativo', true)
      .eq('status', 'pendente');

    if (pendingError) throw pendingError;

    // 3. Fetch Completed Services for the month
    const { count: completedServicesCount, error: servicesError } = await supabase
      .from('servicos_realizados')
      .select('*', { count: 'exact', head: true })
      .eq('ativo', true)
      .eq('status', 'concluido')
      .gte('created_at', firstDayMonthISO)
      .lte('created_at', lastDayMonthISO);

    if (servicesError) throw servicesError;

    // 4. Fetch Today's Appointments
    const { count: todayAppointmentsCount, error: appointmentsError } = await supabase
      .from('agendamentos')
      .select('*', { count: 'exact', head: true })
      .eq('ativo', true)
      .gte('inicio_agendado', startOfTodayISO)
      .lte('inicio_agendado', endOfTodayISO);

    if (appointmentsError) throw appointmentsError;

    // Calculate monthly stats
    let faturamentoMes = 0;
    let despesasMes = 0;
    
    monthlyFinancials?.forEach(item => {
      if (item.status === 'pago') {
        if (item.tipo === 'entrada') faturamentoMes += item.valor;
        else if (item.tipo === 'saida') despesasMes += item.valor;
      }
    });

    // Calculate pending stats
    const pendingTotal = pendingFinancials?.reduce((acc, curr) => acc + curr.valor, 0) || 0;

    const stats: DashboardStats = {
      faturamentoMes,
      despesasMes,
      saldoMes: faturamentoMes - despesasMes,
      servicosConcluidosMes: completedServicesCount || 0,
      agendamentosHoje: todayAppointmentsCount || 0,
      pendenciasFinanceiras: {
        valor: pendingTotal,
        quantidade: pendingFinancials?.length || 0
      }
    };

    // 5. Fetch Lists for Dashboard
    const [
      { data: agendaHoje },
      { data: servicosEmExecucao },
      { data: ultimosServicos },
      { data: ultimasMovimentacoes },
      { data: ultimosClientes }
    ] = await Promise.all([
      // Agenda de hoje
      supabase
        .from('agendamentos')
        .select('*, cliente:clientes(nome)')
        .eq('ativo', true)
        .gte('inicio_agendado', startOfTodayISO)
        .lte('inicio_agendado', endOfTodayISO)
        .order('inicio_agendado', { ascending: true }),
      
      // Serviços em execução
      supabase
        .from('servicos_realizados')
        .select('*, cliente:clientes(nome), veiculo:cliente_veiculos(marca, modelo, placa, tipo_veiculo)')
        .eq('ativo', true)
        .eq('status', 'em_execucao'),
      
      // Últimos serviços realizados
      supabase
        .from('servicos_realizados')
        .select('*, cliente:clientes(nome)')
        .eq('ativo', true)
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Últimas movimentações financeiras
      supabase
        .from('movimentacoes_financeiras')
        .select('*')
        .eq('ativo', true)
        .order('data_competencia', { ascending: false })
        .limit(5),
      
      // Últimos clientes cadastrados
      supabase
        .from('clientes')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    return {
      stats,
      agendaHoje: agendaHoje || [],
      servicosEmExecucao: servicosEmExecucao || [],
      ultimosServicos: ultimosServicos || [],
      ultimasMovimentacoes: ultimasMovimentacoes || [],
      ultimosClientes: ultimosClientes || []
    };
  }
};
