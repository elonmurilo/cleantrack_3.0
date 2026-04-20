import React, { useEffect, useState } from 'react';
import { Users, Search, PlusCircle } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import { clientService } from '../services/clientService';
import { financialService } from '../services/financialService';
import { Summary } from '../types';
import { Cliente, CreateClientePayload, UpdateClientePayload } from '../types/client';
import ClientList from '../components/clients/ClientList';
import ClientForm from '../components/clients/ClientForm';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const Clients: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sum, allClients] = await Promise.all([
        financialService.getSummary(),
        clientService.listClients()
      ]);
      setSummary(sum);
      setClients(allClients);
    } catch (error) {
      console.error("Error fetching clients data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!searchTerm.trim()) {
        const allClients = await clientService.listClients();
        setClients(allClients);
      } else {
        const found = await clientService.searchClients(searchTerm);
        setClients(found);
      }
    } catch (error) {
      console.error("Error searching clients", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    if (!user) return;
    setActionLoading(true);
    try {
      const payload: CreateClientePayload = {
        ...data,
        created_by: user.id
      };
      await clientService.createClient(payload);
      setView('list');
      loadData();
    } catch (error) {
      alert("Erro ao cadastrar cliente. Verifique os dados.");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!user || !selectedClient) return;
    setActionLoading(true);
    try {
      const payload: UpdateClientePayload = {
        ...data,
        updated_by: user.id
      };
      await clientService.updateClient(selectedClient.id, payload);
      setView('list');
      setSelectedClient(null);
      loadData();
    } catch (error) {
      alert("Erro ao atualizar cliente.");
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await clientService.deactivateClient(id, user.id);
      loadData();
    } catch (error) {
      alert("Erro ao desativar cliente.");
      console.error(error);
    }
  };

  const openEdit = (client: Cliente) => {
    setSelectedClient(client);
    setView('edit');
  };

  if (loading && view === 'list' && clients.length === 0) {
    return <div className="loading-container">Carregando clientes...</div>;
  }

  return (
    <>
      <div className="dashboard-grid">
        <StatCard 
          label="Clientes Ativos"
          value={summary?.totalClients.value || 0}
          subtext={summary?.totalClients.growth}
          subtextType="growth"
          icon={<Users size={20} />}
          iconClass="icon-clients"
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.5rem 0' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Gestão de Clientes</h2>
        {view === 'list' && (
          <Button onClick={() => setView('create')} style={{ padding: '0.6rem 1rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <PlusCircle size={18} /> Novo Cliente
          </Button>
        )}
      </div>

      {view === 'list' ? (
        <>
          <div className="card" style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '0.75rem' }}>
              <Search size={18} color="#999" />
              <input 
                type="text" 
                placeholder="Pesquisar por nome ou telefone..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--text-dark)', 
                  width: '100%', 
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
              <Button type="submit" variant="action" style={{ padding: '0.4rem 1rem' }}>Buscar</Button>
            </form>
          </div>

          <ClientList 
            clients={clients} 
            onEdit={openEdit} 
            onDelete={handleDelete} 
          />
        </>
      ) : (
        <ClientForm 
          client={selectedClient}
          onSubmit={view === 'create' ? handleCreate : handleUpdate}
          onCancel={() => {
            setView('list');
            setSelectedClient(null);
          }}
          loading={actionLoading}
        />
      )}
    </>
  );
};

export default Clients;
