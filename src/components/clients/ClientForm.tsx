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
    
    // Passar dados do cliente, lista de veículos e IDs para deletar
    onSubmit(formData, { vehicles, deletedIds: deletedVehicleIds });
  };

  const handleAddVehicle = (vehicleData: any) => {
    // Se este veículo for marcado como principal, desmarcar os outros localmente
    let updatedVehicles = [...vehicles];
    
    if (vehicleData.principal) {
      updatedVehicles = updatedVehicles.map(v => ({ ...v, principal: false }));
    } else if (vehicles.length === 0) {
      // Se for o primeiro veículo e não estiver marcado como principal, marca por padrão
      vehicleData.principal = true;
    }

    if (editingVehicle && editingVehicle.index !== undefined) {
      // Update existing in local state
      updatedVehicles[editingVehicle.index] = { ...vehicleData, id: editingVehicle.vehicle.id };
    } else {
      // Add new to local state
      updatedVehicles.push({ ...vehicleData, ativo: true });
    }
    
    setVehicles(updatedVehicles);
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
    <div className="modal-overlay">
      <div className="modal-content max-w-4xl">
        <div className="modal-header">
          <h2>{client ? 'Editar Cliente' : 'Novo Cliente'}</h2>
          <button onClick={onCancel} className="btn-close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-grid">
            <form id="client-form" onSubmit={handleSubmitInternal} className="form-grid col-span-2">
              <div className="form-group">
                <label>Nome Completo *</label>
                <div className="input-group">
                  <User size={18} color="var(--primary-gold)" />
                  <input 
                    type="text" 
                    placeholder="Ex: João Silva" 
                    value={formData.nome}
                    onChange={e => setFormData({ ...formData, nome: e.target.value })}
                    required 
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Telefone/WhatsApp *</label>
                <div className="input-group">
                  <Phone size={18} color="var(--primary-gold)" />
                  <input 
                    type="text" 
                    placeholder="(00) 00000-0000" 
                    value={formData.telefone}
                    onChange={e => setFormData({ ...formData, telefone: e.target.value })}
                    required 
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group col-span-2">
                <label>E-mail (Opcional)</label>
                <div className="input-group">
                  <Mail size={18} color="var(--primary-gold)" />
                  <input 
                    type="email" 
                    placeholder="joao@exemplo.com" 
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group col-span-2">
                <label>Observações</label>
                <div className="input-group" style={{ alignItems: 'flex-start' }}>
                  <MessageSquare size={18} color="var(--primary-gold)" style={{ marginTop: '0.5rem' }} />
                  <textarea 
                    placeholder="Informações adicionais sobre o cliente..." 
                    value={formData.observacoes}
                    onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
                    style={{ minHeight: '80px' }}
                    disabled={loading}
                  />
                </div>
              </div>
            </form>

            {/* Gestão de Veículos */}
            <div className="form-group col-span-2" style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Car size={20} color="var(--primary-gold)" />
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Veículos</h3>
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
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(235, 180, 63, 0.05)', color: '#854D0E', border: '1px solid rgba(235, 180, 63, 0.2)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', textAlign: 'center' }}>
                  Este cliente ainda não possui veículos cadastrados.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button 
            type="button" 
            onClick={onCancel}
            style={{ 
              backgroundColor: 'transparent', 
              border: '1px solid var(--border-color)', 
              color: 'var(--text-dark)',
              boxShadow: 'none'
            }}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            form="client-form" 
            disabled={loading}
          >
            {loading ? 'Salvando...' : client ? 'Salvar Alterações' : 'Cadastrar Cliente'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientForm;

