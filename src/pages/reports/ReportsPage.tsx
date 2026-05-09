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
        <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-gold)', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BarChart size={24} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Relatórios Gerenciais</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Analise o desempenho do seu negócio em tempo real</p>
        </div>
      </div>

      <div className="tabs-container" style={{ 
        marginBottom: '2rem', 
        display: 'flex', 
        gap: '0.5rem', 
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '4px',
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: '12px',
        width: '100%',
        scrollbarWidth: 'none'
      }}>
        {([
          { key: 'financeiro', label: 'Financeiro', icon: <DollarSign size={16} /> },
          { key: 'servicos', label: 'Serviços', icon: <Briefcase size={16} /> },
          { key: 'clientes', label: 'Clientes', icon: <Users size={16} /> },
          { key: 'produtividade', label: 'Produtividade', icon: <Zap size={16} /> },
        ] as { key: TabType; label: string; icon: React.ReactNode }[]).map(tab => (
          <button
            key={tab.key}
            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.key)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              padding: '0.6rem 1rem', 
              background: activeTab === tab.key ? 'white' : 'transparent', 
              border: 'none', 
              borderRadius: '10px',
              boxShadow: activeTab === tab.key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              color: activeTab === tab.key ? 'var(--primary-gold)' : 'var(--text-muted)', 
              cursor: 'pointer', 
              fontWeight: 600,
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              flex: '1 0 auto',
              fontSize: '0.85rem',
              justifyContent: 'center'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
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
