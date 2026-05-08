import React, { useState, useEffect } from 'react';
import { Search, Info } from 'lucide-react';
import { userAdminService } from '../services/userAdminService';
import { AdminUser, UpdateAdminUserPayload } from '../types/adminUser';
import UserList from '../components/users/UserList';
import UserEditModal from '../components/users/UserEditModal';
import { useAuth } from '../hooks/useAuth';

const UsersPage: React.FC = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userAdminService.getUsers();
      setUsers(data);
    } catch (err: any) {
      console.error(err);
      setError('Não foi possível carregar os usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSaveUser = async (id: string, payload: UpdateAdminUserPayload) => {
    await userAdminService.updateUser(id, payload);
    await fetchUsers(); // Refresh the list
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'todos' || user.papel === roleFilter;
    const matchesStatus = statusFilter === 'todos' || 
                          (statusFilter === 'ativos' && user.ativo) || 
                          (statusFilter === 'inativos' && !user.ativo);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="screen active">
      <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(56, 114, 203, 0.1)', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
          <Info size={20} />
          <h3 style={{ margin: 0, fontSize: '1rem' }}>Informação</h3>
        </div>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-color)', fontSize: '0.9rem' }}>
          Novos usuários devem ser criados manualmente no painel do <strong>Supabase Auth</strong>. Após a criação, eles aparecerão aqui para ajuste de perfil e status.
        </p>
      </div>

      <div className="top-bar" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: '250px' }}>
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-color)' }}
          >
            <option value="todos">Todos os Papéis</option>
            <option value="admin">Administrador</option>
            <option value="gestor">Gestor</option>
            <option value="operador">Operador</option>
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-color)' }}
          >
            <option value="todos">Todos os Status</option>
            <option value="ativos">Ativos</option>
            <option value="inativos">Inativos</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Carregando usuários...</div>
      ) : error ? (
        <div className="empty-state" style={{ color: 'var(--danger-color)' }}>{error}</div>
      ) : (
        <UserList users={filteredUsers} onEdit={setSelectedUser} />
      )}

      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          currentUserRole={profile?.papel}
          currentUserId={profile?.id}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default UsersPage;
