import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Filter, ArrowLeft } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/common/Button';
import ServiceRecordList from '../../components/service-records/ServiceRecordList';
import ServiceRecordForm from '../../components/service-records/ServiceRecordForm';
import { serviceRecordService } from '../../services/serviceRecordService';
import { ServiceRecord, ServiceRecordStatus } from '../../types/serviceRecord';
import { useAuth } from '../../hooks/useAuth';

const ServiceRecordsPage: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ServiceRecord | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await serviceRecordService.listServiceRecords();
      setRecords(data);
    } catch (error) {
      console.error('Erro ao buscar registros de serviço:', error);
      alert('Erro ao carregar serviços realizados do banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCreateOrUpdate = async (formData: any) => {
    if (!user) return;
    
    setFormLoading(true);
    try {
      if (editingRecord) {
        await serviceRecordService.updateServiceRecord(editingRecord.id, {
          ...formData,
          updated_by: user.id
        });
      } else {
        await serviceRecordService.createServiceRecord({
          ...formData,
          created_by: user.id,
          ativo: true
        });
      }
      setShowForm(false);
      setEditingRecord(null);
      fetchRecords();
    } catch (error) {
      console.error('Erro ao salvar registro de serviço:', error);
      alert('Erro ao salvar registro no banco de dados.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: ServiceRecordStatus) => {
    if (!user) return;
    try {
      await serviceRecordService.updateStatus(id, status, user.id);
      fetchRecords();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleCancel = async (id: string) => {
    if (!user) return;
    if (window.confirm('Deseja realmente cancelar este registro de serviço?')) {
      try {
        await serviceRecordService.cancelServiceRecord(id, user.id);
        fetchRecords();
      } catch (error) {
        console.error('Erro ao cancelar serviço:', error);
      }
    }
  };

  const openEdit = (record: ServiceRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  // Cálculo de sumário
  const totalServices = records.length;
  const inProgress = records.filter(r => r.status === 'em_execucao').length;
  const completed = records.filter(r => r.status === 'concluido').length;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <StatCard 
          label="Serviços Realizados"
          value={totalServices}
          subtext={`${completed} concluídos, ${inProgress} em execução`}
          subtextType="status"
          icon={<Briefcase size={20} />}
          iconClass="icon-billing"
        />
        
        <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start', marginTop: '10px' }}>
          {!showForm ? (
            <Button 
              variant="action" 
              onClick={() => { setShowForm(true); setEditingRecord(null); }}
              style={{ padding: '0.8rem 1.2rem' }}
            >
              <Plus size={18} /> Novo Serviço
            </Button>
          ) : (
            <Button 
              variant="action" 
              onClick={() => { setShowForm(false); setEditingRecord(null); }}
              style={{ 
                padding: '0.8rem 1.2rem',
                backgroundColor: 'transparent',
                border: '1px solid var(--primary-gold)',
                color: 'var(--primary-gold)',
                boxShadow: 'none'
              }}
            >
              <ArrowLeft size={18} /> Voltar para Lista
            </Button>
          )}
        </div>
      </div>

      {showForm ? (
        <ServiceRecordForm 
          record={editingRecord}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => { setShowForm(false); setEditingRecord(null); }}
          loading={formLoading}
        />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem 1rem' }}>
            <h4 style={{ margin: 0, color: 'var(--text-muted)' }}>Histórico de Execuções</h4>
            <Filter size={18} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
          </div>
          
          {loading ? (
            <div className="loading-container">Carregando serviços...</div>
          ) : (
            <ServiceRecordList 
              records={records}
              onEdit={openEdit}
              onStatusChange={handleStatusChange}
              onCancel={handleCancel}
            />
          )}
        </>
      )}
    </>
  );
};

export default ServiceRecordsPage;
