import React from 'react';
import { Car, Edit2, Trash2, Star, CheckCircle } from 'lucide-react';
import { ClientVehicle } from '../../types/vehicle';

interface VehicleListProps {
  vehicles: Partial<ClientVehicle>[];
  onEdit: (vehicle: Partial<ClientVehicle>, index?: number) => void;
  onDelete: (id: string | undefined, index?: number) => void;
  onSetPrincipal: (id: string | undefined, index?: number) => void;
  loading?: boolean;
}

const VehicleList: React.FC<VehicleListProps> = ({ 
  vehicles, 
  onEdit, 
  onDelete, 
  onSetPrincipal,
  loading = false 
}) => {
  if (vehicles.length === 0) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed #ccc', borderRadius: ' var(--radius-md)' }}>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>Nenhum veículo cadastrado para este cliente.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {vehicles.map((vehicle, index) => (
        <div 
          key={vehicle.id || `local-${index}`} 
          className="list-item" 
          style={{ 
            padding: '0.75rem 1rem', 
            borderRadius: 'var(--radius-md)',
            border: vehicle.principal ? '1px solid var(--primary-gold)' : '1px solid #eee',
            background: vehicle.principal ? 'rgba(235, 180, 63, 0.05)' : 'var(--white)'
          }}
        >
          <div className="avatar" style={{ width: '40px', height: '40px', background: vehicle.cor || '#eee' }}>
            <Car size={18} color={vehicle.cor ? '#fff' : '#999'} />
          </div>
          
          <div className="item-details" style={{ flex: 1, marginLeft: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="item-name" style={{ fontSize: '0.95rem' }}>{vehicle.marca} {vehicle.modelo}</span>
              {vehicle.principal && (
                <span style={{ 
                  backgroundColor: 'var(--primary-gold)', 
                  color: '#fff', 
                  fontSize: '0.7rem', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}>
                   <Star size={10} fill="#fff" /> Principal
                </span>
              )}
            </div>
            <span className="item-subtext" style={{ fontSize: '0.8rem' }}>
              Placa: {vehicle.placa || 'Sem placa'} | Ano: {vehicle.ano || 'N/A'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {!vehicle.principal && (
              <button 
                onClick={() => onSetPrincipal(vehicle.id, index)}
                title="Definir como principal"
                style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' }}
                disabled={loading}
              >
                <Star size={18} />
              </button>
            )}
            {vehicle.principal && (
               <div title="Veículo principal" style={{ color: 'var(--primary-gold)', display: 'flex', alignItems: 'center' }}>
                 <CheckCircle size={18} />
               </div>
            )}
            
            <button 
              onClick={() => onEdit(vehicle, index)}
              title="Editar veículo"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              disabled={loading}
            >
              <Edit2 size={16} />
            </button>

            <button 
              onClick={() => onDelete(vehicle.id, index)}
              title="Remover veículo"
              style={{ background: 'none', border: 'none', color: '#FFB0B0', cursor: 'pointer' }}
              disabled={loading}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleList;
