import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, DollarSign, Briefcase, Users, Zap, AlertCircle } from 'lucide-react';
import { reportsService } from '../../services/reportsService';
import { ReportFilters as FiltersType } from '../../types/reports';
import ReportFilters from '../../components/reports/ReportFilters';
import FinancialReport from '../../components/reports/FinancialReport';
import ServicesReport from '../../components/reports/ServicesReport';
import ClientsReport from '../../components/reports/ClientsReport';
import ProductivityReport from '../../components/reports/ProductivityReport';

type TabType = 'financeiro' | 'servicos' | 'clientes' | 'produtividade';

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('financeiro');
  
  // Obter datas iniciais para o filtro (primeiro e último dia do mês atual)
  const getInitialDates = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return {
      startDate: firstDay.toISOString().split('T')[0],
      endDate: lastDay.toISOString().split('T')[0]
    };
  };

  const initialDates = getInitialDates();

  const [filters, setFilters] = useState<FiltersType>({
    startDate: initialDates.startDate,
    endDate: initialDates.endDate,
    status: 'todos',
    type: 'todos',
    searchTerm: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Dados dos relatórios
  const [financialData, setFinancialData] = useState<any[]>([]);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [clientsData, setClientsData] = useState<any[]>([]);
  const [productivityData, setProductivityData] = useState<any[]>([]);

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      switch (activeTab) {
        case 'financeiro':
          const finData = await reportsService.getFinancialReport(filters);
          setFinancialData(finData);
          break;
        case 'servicos':
          const servData = await reportsService.getServicesReport(filters);
          setServicesData(servData);
          break;
        case 'clientes':
          const cliData = await reportsService.getClientsReport(filters);
          setClientsData(cliData);
          break;
        case 'produtividade':
          const prodData = await reportsService.getProductivityReport(filters);
          setProductivityData(prodData);
          break;
      }
    } catch (err: any) {
      console.error(`Erro ao buscar relatório de ${activeTab}:`, err);
      setError('Ocorreu um erro ao buscar os dados do relatório. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters]);

  // Buscar dados quando a aba ou os filtros mudam
  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Resetar filtros específicos de aba ao trocar, mantendo as datas
    setFilters(prev => ({
      ...prev,
      status: 'todos',
      type: 'todos',
      searchTerm: ''
    }));
  };

  return (
    <div className="screen active">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <BarChart size={32} color="var(--primary-color)" />
        <h1 style={{ margin: 0 }}>Relatórios Gerenciais</h1>
      </div>

      <div className="tabs-container" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', overflowX: 'auto' }}>
        <button 
          className={`tab-button ${activeTab === 'financeiro' ? 'active' : ''}`}
          onClick={() => handleTabChange('financeiro')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'financeiro' ? '2px solid var(--primary-color)' : '2px solid transparent', color: activeTab === 'financeiro' ? 'var(--primary-color)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}
        >
          <DollarSign size={18} /> Financeiro
        </button>
        <button 
          className={`tab-button ${activeTab === 'servicos' ? 'active' : ''}`}
          onClick={() => handleTabChange('servicos')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'servicos' ? '2px solid var(--primary-color)' : '2px solid transparent', color: activeTab === 'servicos' ? 'var(--primary-color)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}
        >
          <Briefcase size={18} /> Serviços
        </button>
        <button 
          className={`tab-button ${activeTab === 'clientes' ? 'active' : ''}`}
          onClick={() => handleTabChange('clientes')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'clientes' ? '2px solid var(--primary-color)' : '2px solid transparent', color: activeTab === 'clientes' ? 'var(--primary-color)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}
        >
          <Users size={18} /> Clientes
        </button>
        <button 
          className={`tab-button ${activeTab === 'produtividade' ? 'active' : ''}`}
          onClick={() => handleTabChange('produtividade')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: activeTab === 'produtividade' ? '2px solid var(--primary-color)' : '2px solid transparent', color: activeTab === 'produtividade' ? 'var(--primary-color)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}
        >
          <Zap size={18} /> Produtividade
        </button>
      </div>

      <ReportFilters 
        filters={filters} 
        onChange={setFilters} 
        activeTab={activeTab} 
      />

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255, 77, 77, 0.1)', color: 'var(--danger-color)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', borderLeft: '4px solid var(--danger-color)' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-state" style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
          Carregando dados do relatório...
        </div>
      ) : (
        <div className="report-content">
          {activeTab === 'financeiro' && <FinancialReport data={financialData} />}
          {activeTab === 'servicos' && <ServicesReport data={servicesData} />}
          {activeTab === 'clientes' && <ClientsReport data={clientsData} />}
          {activeTab === 'produtividade' && <ProductivityReport data={productivityData} />}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
