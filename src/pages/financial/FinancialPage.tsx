import React, { useEffect, useState, useContext } from 'react';
import { Plus, Filter, Search, Download } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';
import { financialService } from '../../services/financialService';
import { 
  FinancialRecord, 
  FinancialSummaryData, 
  FinancialStatus 
} from '../../types/financial';
import FinancialSummary from '../../components/financial/FinancialSummary';
import FinancialList from '../../components/financial/FinancialList';
import FinancialForm from '../../components/financial/FinancialForm';
import Button from '../../components/common/Button';

const FinancialPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<FinancialRecord[]>([]);
  const [summary, setSummary] = useState<FinancialSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<FinancialRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recordsData, summaryData] = await Promise.all([
        financialService.listRecords(),
        financialService.getFinancialSummary()
      ]);
      setRecords(recordsData);
      setFilteredRecords(recordsData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Erro ao buscar dados financeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = records;

    if (searchTerm) {
      result = result.filter(r => 
        r.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'todos') {
      result = result.filter(r => r.tipo === filterType);
    }

    setFilteredRecords(result);
  }, [searchTerm, filterType, records]);

  const handleCreate = () => {
    setCurrentRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: FinancialRecord) => {
    setCurrentRecord(record);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (currentRecord) {
        await financialService.updateRecord(currentRecord.id, data);
      } else {
        await financialService.createRecord(data);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Erro ao salvar movimentação');
    }
  };

  const handleStatusChange = async (id: string, status: FinancialStatus) => {
    if (!auth?.user?.id) return;
    
    try {
      const updateData: any = { status, updated_by: auth.user.id };
      
      if (status === 'pago') {
        updateData.data_pagamento = new Date().toISOString().split('T')[0];
        // Poderia abrir um mini-modal para escolher a forma de pagamento, 
        // mas por simplicidade vamos manter o que já estava ou 'pix' como padrão se for novo
      }

      await financialService.updateStatus(id, status, auth.user.id, updateData);
      fetchData();
    } catch (error) {
      alert('Erro ao atualizar status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!auth?.user?.id) return;
    if (!window.confirm('Deseja realmente excluir esta movimentação?')) return;

    try {
      await financialService.deactivateRecord(id, auth.user.id);
      fetchData();
    } catch (error) {
      alert('Erro ao excluir movimentação');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Controle Financeiro</h1>
          <p className="text-gray-500">Gerencie entradas, saídas e fluxo de caixa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="action">
            <Download size={20} />
            Exportar
          </Button>
          <Button onClick={handleCreate}>
            <Plus size={20} />
            Nova Movimentação
          </Button>
        </div>
      </div>

      {summary && <FinancialSummary summary={summary} />}

      <div className="content-card mt-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="search-bar flex-1">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Pesquisar por descrição, categoria ou cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="flex gap-2">
            <div className="filter-select">
              <Filter size={20} className="mr-2 text-gray-400" />
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent outline-none"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="entrada">Entradas</option>
                <option value="saida">Saídas</option>
              </select>
            </div>
          </div>
        </div>

        <FinancialList 
          records={filteredRecords}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      {isModalOpen && (
        <FinancialForm 
          record={currentRecord}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
          userId={auth?.user?.id || ''}
        />
      )}
    </div>
  );
};

export default FinancialPage;
