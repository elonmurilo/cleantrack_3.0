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
    <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid var(--border-color)', display: 'block' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '0.5rem', backgroundColor: 'rgba(235, 180, 63, 0.1)', borderRadius: '8px', color: 'var(--primary-gold)' }}>
          <Filter size={20} />
        </div>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Filtros do Relatório</h3>
      </div>
      
      <div className="form-grid">
        {/* Filtros Comuns (Datas) */}
        <div className="form-group">
          <label htmlFor="startDate">Data Inicial</label>
          <div className="input-group">
            <input 
              type="date" 
              id="startDate" 
              name="startDate" 
              value={filters.startDate} 
              onChange={handleChange} 
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="endDate">Data Final</label>
          <div className="input-group">
            <input 
              type="date" 
              id="endDate" 
              name="endDate" 
              value={filters.endDate} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* Filtros Específicos por Aba */}
        {activeTab === 'financeiro' && (
          <>
            <div className="form-group">
              <label htmlFor="type">Tipo</label>
              <div className="input-group">
                <select id="type" name="type" value={filters.type} onChange={handleChange}>
                  <option value="todos">Todos</option>
                  <option value="entrada">Entrada</option>
                  <option value="saida">Saída</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <div className="input-group">
                <select id="status" name="status" value={filters.status} onChange={handleChange}>
                  <option value="todos">Todos</option>
                  <option value="pago">Pago</option>
                  <option value="pendente">Pendente</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="atrasado">Atrasado</option>
                </select>
              </div>
            </div>
          </>
        )}

        {activeTab === 'servicos' && (
          <div className="form-group">
            <label htmlFor="status">Status do Serviço</label>
            <div className="input-group">
              <select id="status" name="status" value={filters.status} onChange={handleChange}>
                <option value="todos">Todos</option>
                <option value="aberto">Aberto</option>
                <option value="em_execucao">Em Execução</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'clientes' && (
          <div className="form-group col-span-2">
            <label htmlFor="searchTerm">Busca (Nome, Telefone, E-mail)</label>
            <div className="input-group">
              <Search size={18} color="var(--text-muted)" />
              <input 
                type="text" 
                id="searchTerm" 
                name="searchTerm" 
                placeholder="Buscar clientes por nome, telefone ou e-mail..." 
                value={filters.searchTerm} 
                onChange={handleChange} 
              />
            </div>
          </div>
        )}

        {activeTab === 'produtividade' && (
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <div className="input-group">
              <select id="status" name="status" value={filters.status} onChange={handleChange}>
                <option value="todos">Todos</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportFilters;
