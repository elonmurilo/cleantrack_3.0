import React, { useState, useEffect } from 'react';
import { Car, X, Tag, Calendar, Info, CheckCircle } from 'lucide-react';
import { ClientVehicle } from '../../types/vehicle';
import Button from '../common/Button';

interface VehicleFormProps {
  vehicle?: Partial<ClientVehicle> | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
  isNewClient?: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ 
  vehicle, 
  onSubmit, 
  onCancel, 
  loading,
  isNewClient = false
}) => {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    cor: '',
    placa: '',
    ano: new Date().getFullYear(),
    observacoes: '',
    principal: false
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        marca: vehicle.marca || '',
        modelo: vehicle.modelo || '',
        cor: vehicle.cor || '',
        placa: vehicle.placa || '',
        ano: vehicle.ano || new Date().getFullYear(),
        observacoes: vehicle.observacoes || '',
        principal: vehicle.principal || false
      });
    }
  }, [vehicle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="card" style={{ display: 'block', padding: '1.5rem', border: '1px solid var(--primary-gold)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
          {vehicle?.id ? 'Editar Veículo' : 'Adicionar Veículo'}
        </h3>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="login-form" style={{ gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <Tag size={18} color="var(--primary-gold)" />
            <input 
              type="text" 
              placeholder="Marca (ex: Toyota) *" 
              value={formData.marca}
              onChange={e => setFormData({ ...formData, marca: e.target.value })}
              required 
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <Car size={18} color="var(--primary-gold)" />
            <input 
              type="text" 
              placeholder="Modelo (ex: Corolla) *" 
              value={formData.modelo}
              onChange={e => setFormData({ ...formData, modelo: e.target.value })}
              required 
              disabled={loading}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: formData.cor || '#ccc', border: '1px solid #999' }}></div>
            <input 
              type="text" 
              placeholder="Cor (ex: Prata)" 
              value={formData.cor}
              onChange={e => setFormData({ ...formData, cor: e.target.value })}
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <Tag size={18} color="var(--primary-gold)" />
            <input 
              type="text" 
              placeholder="Placa (ex: ABC-1234)" 
              value={formData.placa}
              onChange={e => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
              disabled={loading}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
          <div className="input-group">
            <Calendar size={18} color="var(--primary-gold)" />
            <input 
              type="number" 
              placeholder="Ano" 
              value={formData.ano}
              onChange={e => setFormData({ ...formData, ano: parseInt(e.target.value) })}
              disabled={loading}
            />
          </div>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              cursor: 'pointer',
              color: formData.principal ? 'var(--primary-gold)' : 'var(--text-muted)'
            }}
            onClick={() => setFormData({ ...formData, principal: !formData.principal })}
          >
            {formData.principal ? <CheckCircle size={20} /> : <div style={{ width: 20, height: 20, border: '2px solid #ccc', borderRadius: '50%' }}></div>}
            <span style={{ fontSize: '0.9rem' }}>Veículo Principal</span>
          </div>
        </div>

        <div className="input-group" style={{ alignItems: 'flex-start' }}>
          <Info size={18} color="var(--primary-gold)" style={{ marginTop: '0.5rem' }} />
          <textarea 
            placeholder="Observações do veículo" 
            value={formData.observacoes}
            onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
            style={{ minHeight: '60px' }}
            disabled={loading}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <Button 
            type="button" 
            onClick={onCancel}
            style={{ 
              backgroundColor: 'transparent', 
              border: '1px solid #ddd', 
              color: 'var(--text-dark)',
              boxShadow: 'none',
              flex: 1,
              padding: '1rem'
            }}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} style={{ flex: 1 }}>
            {loading ? 'Salvando...' : vehicle?.id ? 'Atualizar' : 'Adicionar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
