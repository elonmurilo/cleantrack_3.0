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
        <div key={client.id} className="list-item card" style={{ display: 'block', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <Avatar 
              initials={getInitials(client.nome)} 
              color="#EBB43F"
            />
            <div className="item-details" style={{ minWidth: 0, flex: 1 }}>
              <span className="item-name" style={{ display: 'block', fontSize: '1.1rem', overflowWrap: 'break-word', wordBreak: 'break-word' }}>{client.nome}</span>
              <span className="item-subtext" style={{ display: 'flex', alignItems: 'center', marginTop: '6px', overflowWrap: 'break-word' }}>
                <Phone size={14} style={{ marginRight: '6px', flexShrink: 0 }} /> {client.telefone}
              </span>
              {client.email && (
                <span className="item-subtext" style={{ display: 'flex', alignItems: 'center', marginTop: '6px', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                  <Mail size={14} style={{ marginRight: '6px', flexShrink: 0 }} /> {client.email}
                </span>
              )}
            </div>
          </div>
          
          <div className="item-actions" style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '8px', 
            paddingTop: '1rem', 
            marginTop: '1rem', 
            borderTop: '1px solid #f0f0f0',
            justifyContent: 'flex-end' 
          }}>
            <Button 
              variant="action" 
              onClick={() => onEdit(client)}
              title="Editar Cliente"
              style={{ backgroundColor: 'transparent', color: 'var(--text-dark)', border: '1px solid #ddd', padding: '0.4rem 0.75rem' }}
            >
              <Edit2 size={16} />
            </Button>
            <Button 
              variant="action" 
              onClick={() => {
                if (window.confirm('Deseja realmente desativar este cliente?')) {
                  onDelete(client.id);
                }
              }}
              title="Excluir Cliente"
              style={{ backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ffcccc', padding: '0.4rem 0.75rem' }}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientList;
