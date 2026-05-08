import React from 'react';
import { Edit2, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { AdminUser } from '../../types/adminUser';
import Button from '../common/Button';

interface UserListProps {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
}

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'admin':
      return <span className="status-badge" style={{ backgroundColor: 'rgba(255, 77, 77, 0.1)', color: 'var(--danger-color)' }}><ShieldAlert size={12} style={{ marginRight: 4 }}/> Admin</span>;
    case 'gestor':
      return <span className="status-badge" style={{ backgroundColor: 'rgba(255, 171, 0, 0.1)', color: 'var(--warning-color)' }}><ShieldCheck size={12} style={{ marginRight: 4 }}/> Gestor</span>;
    case 'operador':
    default:
      return <span className="status-badge" style={{ backgroundColor: 'rgba(56, 203, 137, 0.1)', color: 'var(--success-color)' }}><Shield size={12} style={{ marginRight: 4 }}/> Operador</span>;
  }
};

const UserList: React.FC<UserListProps> = ({ users, onEdit }) => {
  if (users.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhum usuário encontrado com os filtros atuais.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Papel</th>
            <th>Status</th>
            <th>Data de Criação</th>
            <th style={{ textAlign: 'right' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ opacity: user.ativo ? 1 : 0.6 }}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="avatar" style={{ width: 32, height: 32, backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold' }}>
                    {user.nome.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 500, color: !user.ativo ? 'var(--text-muted)' : 'inherit' }}>{user.nome}</span>
                </div>
              </td>
              <td style={{ color: !user.ativo ? 'var(--text-muted)' : 'inherit' }}>{user.email}</td>
              <td>{getRoleBadge(user.papel)}</td>
              <td>
                <span className="status-badge" style={{
                  backgroundColor: user.ativo ? 'rgba(56, 203, 137, 0.1)' : 'rgba(255, 77, 77, 0.1)',
                  color: user.ativo ? 'var(--success-color)' : 'var(--danger-color)',
                }}>
                  {user.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td style={{ color: 'var(--text-muted)' }}>
                {user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-'}
              </td>
              <td style={{ textAlign: 'right' }}>
                <Button variant="secondary" onClick={() => onEdit(user)} style={{ padding: '0.25rem 0.5rem' }}>
                  <Edit2 size={16} /> <span className="sr-only">Editar</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
