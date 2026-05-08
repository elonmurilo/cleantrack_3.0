import React from 'react';
import { Search, Filter } from 'lucide-react';
import { ReportFilters as FiltersType } from '../../types/reports';

interface ReportFiltersProps {
  filters: FiltersType;
  onChange: (newFilters: FiltersType) => void;
  activeTab: 'financeiro' | 'servicos' | 'clientes' | 'produtividade';
}

const ReportFilters: React.FC<ReportFiltersProps> = ({ filters, onChange, activeTab }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
        <Filter size={18} />
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Filtros</h3>
      </div>
      
      <div className="form-grid">
        {/* Filtros Comuns (Datas) */}
        <div className="form-group">
          <label htmlFor="startDate">Data Inicial</label>
          <input 
            type="date" 
            id="startDate" 
            name="startDate" 
            value={filters.startDate} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">Data Final</label>
          <input 
            type="date" 
            id="endDate" 
            name="endDate" 
            value={filters.endDate} 
            onChange={handleChange} 
          />
        </div>

        {/* Filtros Específicos por Aba */}
        {activeTab === 'financeiro' && (
          <>
            <div className="form-group">
              <label htmlFor="type">Tipo</label>
              <select id="type" name="type" value={filters.type} onChange={handleChange}>
                <option value="todos">Todos</option>
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={filters.status} onChange={handleChange}>
                <option value="todos">Todos</option>
                <option value="pago">Pago</option>
                <option value="pendente">Pendente</option>
                <option value="cancelado">Cancelado</option>
                <option value="atrasado">Atrasado</option>
              </select>
            </div>
          </>
        )}

        {activeTab === 'servicos' && (
          <div className="form-group">
            <label htmlFor="status">Status do Serviço</label>
            <select id="status" name="status" value={filters.status} onChange={handleChange}>
              <option value="todos">Todos</option>
              <option value="aberto">Aberto</option>
              <option value="em_execucao">Em Execução</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        )}

        {activeTab === 'clientes' && (
          <div className="form-group full-width">
            <label htmlFor="searchTerm">Busca (Nome, Telefone, E-mail)</label>
            <div className="search-bar" style={{ margin: 0, width: '100%' }}>
              <Search size={20} />
              <input 
                type="text" 
                id="searchTerm" 
                name="searchTerm" 
                placeholder="Buscar clientes..." 
                value={filters.searchTerm} 
                onChange={handleChange} 
              />
            </div>
          </div>
        )}

        {activeTab === 'produtividade' && (
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={filters.status} onChange={handleChange}>
              <option value="todos">Todos</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportFilters;
