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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Controle de Usuários</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Gerencie permissões e acessos da equipe</p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1.25rem', backgroundColor: 'rgba(56, 114, 203, 0.05)', borderRadius: '12px', border: '1px solid rgba(56, 114, 203, 0.1)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ padding: '0.5rem', backgroundColor: 'rgba(56, 114, 203, 0.1)', borderRadius: '8px', color: 'var(--primary-color)' }}>
          <Info size={20} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--primary-color)' }}>Gestão de Acessos</h3>
          <p style={{ marginTop: '0.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Novos usuários devem ser criados manualmente no painel do <strong>Supabase Auth</strong>. Após a criação, eles aparecerão aqui para ajuste de perfil e status.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '0.75rem 1rem', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div className="input-group" style={{ flex: 1, border: 'none', padding: 0 }}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou e-mail..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'none', border: 'none', width: '100%', outline: 'none', padding: '0.5rem 0' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', fontWeight: 500, color: 'var(--text-dark)' }}
            >
              <option value="todos">Todos os Papéis</option>
              <option value="admin">Administrador</option>
              <option value="gestor">Gestor</option>
              <option value="operador">Operador</option>
            </select>

            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', fontWeight: 500, color: 'var(--text-dark)' }}
            >
              <option value="todos">Todos os Status</option>
              <option value="ativos">Ativos</option>
              <option value="inativos">Inativos</option>
            </select>
          </div>
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
