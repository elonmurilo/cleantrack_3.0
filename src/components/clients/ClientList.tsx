import React from 'react';
import { User, Phone, Mail, Edit2, Trash2 } from 'lucide-react';
import { Cliente } from '../../types/client';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

interface ClientListProps {
  clients: Cliente[];
  onEdit: (client: Cliente) => void;
  onDelete: (id: string) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onEdit, onDelete }) => {
  if (clients.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhum cliente ativo encontrado.</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="list-grid">
      {clients.map(client => (
        <div key={client.id} className="list-item">
          <Avatar 
            initials={getInitials(client.nome)} 
            color="#EBB43F" // Usando gold por padrão para clientes
          />
          <div className="item-details">
            <span className="item-name">{client.nome}</span>
            <span className="item-subtext">
              <Phone size={12} style={{ marginRight: '4px' }} /> {client.telefone}
            </span>
            {client.email && (
              <span className="item-subtext">
                <Mail size={12} style={{ marginRight: '4px' }} /> {client.email}
              </span>
            )}
          </div>
          <div className="item-actions" style={{ display: 'flex', gap: '8px' }}>
            <Button 
              variant="action" 
              onClick={() => onEdit(client)}
              style={{ backgroundColor: 'transparent', color: 'var(--text-dark)', border: '1px solid #ddd' }}
            >
              <Edit2 size={14} />
            </Button>
            <Button 
              variant="action" 
              onClick={() => {
                if (window.confirm('Deseja realmente desativar este cliente?')) {
                  onDelete(client.id);
                }
              }}
              style={{ backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ffcccc' }}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientList;
