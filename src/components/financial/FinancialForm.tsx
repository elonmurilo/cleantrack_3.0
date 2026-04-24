import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { 
  FinancialRecord, 
  FinancialType, 
  FinancialStatus, 
  PaymentMethod 
} from '../../types/financial';
import { clientService } from '../../services/clientService';
import { serviceRecordService } from '../../services/serviceRecordService';
import { Cliente } from '../../types/client';
import { ServiceRecord } from '../../types/serviceRecord';
import Button from '../common/Button';

interface FinancialFormProps {
  record?: FinancialRecord | null;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  userId: string;
}

const FinancialForm: React.FC<FinancialFormProps> = ({ 
  record, 
  onSave, 
  onCancel,
  userId 
}) => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  
  const [formData, setFormData] = useState({
    tipo: (record?.tipo || 'entrada') as FinancialType,
    status: (record?.status || 'pendente') as FinancialStatus,
    descricao: record?.descricao || '',
    categoria: record?.categoria || '',
    valor: record?.valor || 0,
    data_competencia: record?.data_competencia ? record.data_competencia.split('T')[0] : new Date().toISOString().split('T')[0],
    data_pagamento: record?.data_pagamento ? record.data_pagamento.split('T')[0] : '',
    forma_pagamento: (record?.forma_pagamento || '') as PaymentMethod | '',
    cliente_id: record?.cliente_id || '',
    servico_realizado_id: record?.servico_realizado_id || '',
    observacoes: record?.observacoes || ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsData, servicesData] = await Promise.all([
          clientService.listClients(),
          serviceRecordService.listServiceRecords()
        ]);
        setClients(clientsData);
        setServices(servicesData);
      } catch (error) {
        console.error('Erro ao carregar dados para o formulário:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'valor' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        data_pagamento: formData.status === 'pago' ? formData.data_pagamento : null,
        forma_pagamento: formData.status === 'pago' ? formData.forma_pagamento : null,
        cliente_id: formData.cliente_id || null,
        servico_realizado_id: formData.servico_realizado_id || null,
        [record ? 'updated_by' : 'created_by']: userId
      };
      await onSave(payload);
    } catch (error) {
      console.error('Erro ao salvar movimentação:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-2xl">
        <div className="modal-header">
          <h2>{record ? 'Editar Movimentação' : 'Nova Movimentação'}</h2>
          <button onClick={onCancel} className="btn-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label>Tipo *</label>
              <select 
                name="tipo" 
                value={formData.tipo} 
                onChange={handleChange}
                required
                className="form-control"
              >
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                required
                className="form-control"
              >
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div className="form-group md:col-span-2">
              <label>Descrição *</label>
              <input 
                type="text" 
                name="descricao" 
                value={formData.descricao} 
                onChange={handleChange}
                required
                placeholder="Ex: Pagamento Lavagem Completa"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Categoria *</label>
              <input 
                type="text" 
                name="categoria" 
                value={formData.categoria} 
                onChange={handleChange}
                required
                placeholder="Ex: Serviços, Aluguel, Produtos"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Valor (R$) *</label>
              <input 
                type="number" 
                step="0.01"
                name="valor" 
                value={formData.valor} 
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Data de Competência *</label>
              <input 
                type="date" 
                name="data_competencia" 
                value={formData.data_competencia} 
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>

            {formData.status === 'pago' && (
              <>
                <div className="form-group">
                  <label>Data de Pagamento *</label>
                  <input 
                    type="date" 
                    name="data_pagamento" 
                    value={formData.data_pagamento} 
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Forma de Pagamento *</label>
                  <select 
                    name="forma_pagamento" 
                    value={formData.forma_pagamento} 
                    onChange={handleChange}
                    required
                    className="form-control"
                  >
                    <option value="">Selecione...</option>
                    <option value="pix">Pix</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="transferencia">Transferência</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label>Cliente (Opcional)</label>
              <select 
                name="cliente_id" 
                value={formData.cliente_id} 
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Nenhum</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Serviço Vinculado (Opcional)</label>
              <select 
                name="servico_realizado_id" 
                value={formData.servico_realizado_id} 
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Nenhum</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.titulo} - {s.cliente?.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-group md:col-span-2">
              <label>Observações</label>
              <textarea 
                name="observacoes" 
                value={formData.observacoes} 
                onChange={handleChange}
                rows={3}
                className="form-control"
              />
            </div>
          </div>

          <div className="modal-footer mt-6">
            <Button type="button" variant="action" onClick={onCancel} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-dark)' }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinancialForm;
