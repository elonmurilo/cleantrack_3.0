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
import { exportToCsv } from '../../utils/exportCsv';

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

  const handleExport = () => {
    if (filteredRecords.length === 0) {
      alert('Não há dados para exportar com os filtros atuais.');
      return;
    }

    const headers = [
      'Data de competência',
      'Data de pagamento',
      'Tipo',
      'Status',
      'Descrição',
      'Categoria',
      'Forma de pagamento',
      'Cliente',
      'Serviço vinculado',
      'Valor',
      'Observações'
    ];

    const data = filteredRecords.map(r => {
      // Formatação de data
      const formatData = (d: string | null | undefined) => d ? new Date(d).toLocaleDateString('pt-BR') : '';
      
      // Formatação de valor (Ex: 1500.50 -> R$ 1.500,50)
      const formatValor = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

      return [
        formatData(r.data_competencia),
        formatData(r.data_pagamento),
        r.tipo === 'entrada' ? 'Entrada' : 'Saída',
        r.status.charAt(0).toUpperCase() + r.status.slice(1),
        r.descricao,
        r.categoria,
        r.forma_pagamento ? r.forma_pagamento.toUpperCase() : '',
        r.cliente?.nome || '',
        r.servico_realizado?.titulo || '',
        formatValor(r.valor),
        r.observacoes || ''
      ];
    });

    const dataAtual = new Date().toISOString().split('T')[0];
    const filename = `faturamento-cleantrack-${dataAtual}.csv`;

    exportToCsv(filename, headers, data);
  };

  return (
    <div className="screen active">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Controle Financeiro</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Gerencie suas entradas, saídas e saúde financeira</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', width: '100%', maxWidth: '360px' }}>
          <Button onClick={handleExport} variant="action" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-dark)', flex: '1 1 auto', whiteSpace: 'nowrap' }}>
            <Download size={18} /> Exportar CSV
          </Button>
          <Button onClick={handleCreate} style={{ flex: '1 1 auto', whiteSpace: 'nowrap' }}>
            <Plus size={18} /> Nova Movimentação
          </Button>
        </div>
      </div>

      {summary && <FinancialSummary summary={summary} />}

      <div style={{ marginTop: '2rem' }}>
        <div className="card" style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <div className="input-group" style={{ flex: 1, border: 'none', padding: 0 }}>
              <Search size={20} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Pesquisar por descrição, categoria ou cliente..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: 'none', border: 'none', width: '100%', outline: 'none', padding: '0.5rem 0' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
              <Filter size={18} color="var(--text-muted)" />
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                style={{ background: 'none', border: 'none', outline: 'none', fontWeight: 500, color: 'var(--text-dark)' }}
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
