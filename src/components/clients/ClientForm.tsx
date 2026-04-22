import React, { useState, useEffect } from 'react';
import { Mail, Phone, User, MessageSquare, X, Car, Plus } from 'lucide-react';
import { Cliente, CreateClientePayload, UpdateClientePayload } from '../../types/client';
import { ClientVehicle } from '../../types/vehicle';
import { vehicleService } from '../../services/vehicleService';
import Button from '../common/Button';
import VehicleList from './VehicleList';
import VehicleForm from './VehicleForm';

interface ClientFormProps {
  client?: Cliente | null;
  onSubmit: (clientData: any, vehicleData: { vehicles: Partial<ClientVehicle>[], deletedIds: string[] }) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    observacoes: ''
  });

  const [vehicles, setVehicles] = useState<Partial<ClientVehicle>[]>([]);
  const [deletedVehicleIds, setDeletedVehicleIds] = useState<string[]>([]);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<{ vehicle: Partial<ClientVehicle>, index?: number } | null>(null);
  const [fetchingVehicles, setFetchingVehicles] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData({
        nome: client.nome || '',
        telefone: client.telefone || '',
        email: client.email || '',
        observacoes: client.observacoes || ''
      });
      
      // Carregar veículos reais se estiver editando
      const loadVehicles = async () => {
        setFetchingVehicles(true);
        try {
          const data = await vehicleService.listVehiclesByClient(client.id);
          setVehicles(data);
        } catch (error) {
          console.error('Erro ao carregar veículos:', error);
        } finally {
          setFetchingVehicles(false);
        }
      };
      loadVehicles();
    } else {
      // Se for novo cliente, começa com lista vazia
      setVehicles([]);
    }
  }, [client]);

  const handleSubmitInternal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (vehicles.length === 0) {
      alert("Por favor, adicione pelo menos um veículo para este cliente.");
      return;
    }
    
    // Passar dados do cliente, lista de veículos e IDs para deletar
    onSubmit(formData, { vehicles, deletedIds: deletedVehicleIds });
  };

  const handleAddVehicle = (vehicleData: any) => {
    if (editingVehicle && editingVehicle.index !== undefined) {
      // Update existing in local state
      const updated = [...vehicles];
      updated[editingVehicle.index] = { ...vehicleData, id: editingVehicle.vehicle.id };
      setVehicles(updated);
    } else {
      // Add new to local state
      // Se for o primeiro veículo, marca como principal por padrão
      if (vehicles.length === 0) {
        vehicleData.principal = true;
      } else if (vehicleData.principal) {
        // Se este for marcado como principal, desmarcar os outros localmente
        setVehicles(vehicles.map(v => ({ ...v, principal: false })));
      }
      setVehicles([...vehicles, { ...vehicleData, ativo: true }]);
    }
    setShowVehicleForm(false);
    setEditingVehicle(null);
  };

  const handleEditVehicle = (vehicle: Partial<ClientVehicle>, index?: number) => {
    setEditingVehicle({ vehicle, index });
    setShowVehicleForm(true);
  };

  const handleDeleteVehicle = (id: string | undefined, index?: number) => {
    if (window.confirm("Deseja remover este veículo?")) {
      if (id) {
        setDeletedVehicleIds([...deletedVehicleIds, id]);
      }
      
      const updated = [...vehicles];
      if (index !== undefined) {
        updated.splice(index, 1);
        setVehicles(updated);
      }
    }
  };

  const handleSetPrincipal = (id: string | undefined, index?: number) => {
     const updated = vehicles.map((v, i) => ({
       ...v,
       principal: i === index
     }));
     setVehicles(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Dados Básicos do Cliente */}
      <div className="card" style={{ display: 'block', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0 }}>{client ? 'Editar Cliente' : 'Novo Cliente'}</h3>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
            <X size={20} />
          </button>
        </div>

        <form id="client-form" onSubmit={handleSubmitInternal} className="login-form" style={{ gap: '1.2rem' }}>
          <div className="input-group">
            <User size={18} color="var(--primary-gold)" />
            <input 
              type="text" 
              placeholder="Nome Completo *" 
              value={formData.nome}
              onChange={e => setFormData({ ...formData, nome: e.target.value })}
              required 
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <Phone size={18} color="var(--primary-gold)" />
            <input 
              type="text" 
              placeholder="Telefone/WhatsApp *" 
              value={formData.telefone}
              onChange={e => setFormData({ ...formData, telefone: e.target.value })}
              required 
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <Mail size={18} color="var(--primary-gold)" />
            <input 
              type="email" 
              placeholder="E-mail" 
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="input-group" style={{ alignItems: 'flex-start' }}>
            <MessageSquare size={18} color="var(--primary-gold)" style={{ marginTop: '0.5rem' }} />
            <textarea 
              placeholder="Observações" 
              value={formData.observacoes}
              onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
              style={{ minHeight: '80px' }}
              disabled={loading}
            />
          </div>
        </form>
      </div>

      {/* Gestão de Veículos */}
      <div className="card" style={{ display: 'block', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Car size={20} color="var(--primary-gold)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Veículos do Cliente</h3>
          </div>
          <Button 
            variant="action" 
            onClick={() => { setEditingVehicle(null); setShowVehicleForm(true); }}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Novo Veículo
          </Button>
        </div>

        {showVehicleForm && (
          <div style={{ marginBottom: '1.5rem' }}>
            <VehicleForm 
              vehicle={editingVehicle?.vehicle}
              onSubmit={handleAddVehicle}
              onCancel={() => { setShowVehicleForm(false); setEditingVehicle(null); }}
              loading={false}
              isNewClient={!client}
            />
          </div>
        )}

        <VehicleList 
          vehicles={vehicles}
          onEdit={handleEditVehicle}
          onDelete={handleDeleteVehicle}
          onSetPrincipal={handleSetPrincipal}
          loading={fetchingVehicles}
        />
        
        {vehicles.length === 0 && !showVehicleForm && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'rgba(235, 180, 63, 0.1)', color: 'var(--primary-gold)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', textAlign: 'center' }}>
            <strong>Atenção:</strong> É necessário cadastrar pelo menos um veículo para salvar o cliente.
          </div>
        )}
      </div>

      {/* Botões de Ação Principal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Button 
          type="button" 
          onClick={onCancel}
          style={{ 
            backgroundColor: 'transparent', 
            border: '1px solid #ddd', 
            color: 'var(--text-dark)',
            boxShadow: 'none'
          }}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          form="client-form" // Trigger the form in the first card
          disabled={loading || vehicles.length === 0}
        >
          {loading ? 'Salvando...' : client ? 'Salvar Tudo' : 'Cadastrar Cliente e Veículos'}
        </Button>
      </div>
    </div>
  );
};

export default ClientForm;

