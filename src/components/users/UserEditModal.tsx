import React, { useState } from 'react';
import { X } from 'lucide-react';
import { AdminUser, UpdateAdminUserPayload } from '../../types/adminUser';
import { UserRole } from '../../types/user';
import Button from '../common/Button';

interface UserEditModalProps {
  user: AdminUser;
  currentUserRole?: UserRole;
  currentUserId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, payload: UpdateAdminUserPayload) => Promise<void>;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ user, currentUserId, isOpen, onClose, onSave }) => {
  const [nome, setNome] = useState(user.nome);
  const [papel, setPapel] = useState<UserRole>(user.papel);
  const [ativo, setAtivo] = useState(user.ativo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isSelf = currentUserId === user.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setError('O nome é obrigatório.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await onSave(user.id, { nome, papel, ativo });
      onClose();
    } catch (err: any) {
      console.error(err);
      setError('Erro ao salvar as alterações do usuário. Verifique as permissões.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Usuário</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Fechar modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group full-width">
            <label>E-mail (Login)</label>
            <input 
              type="email" 
              value={user.email} 
              disabled 
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
              title="A alteração de e-mail não é permitida por aqui."
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="nome">Nome</label>
            <input 
              id="nome"
              type="text" 
              value={nome} 
              onChange={e => setNome(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="papel">Papel / Perfil</label>
            <select 
              id="papel" 
              value={papel} 
              onChange={e => setPapel(e.target.value as UserRole)}
            >
              <option value="admin">Administrador</option>
              <option value="gestor">Gestor</option>
              <option value="operador">Operador</option>
            </select>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: isSelf ? 'not-allowed' : 'pointer', gap: '0.5rem', marginBottom: 0 }}>
              <input 
                type="checkbox" 
                checked={ativo} 
                onChange={e => setAtivo(e.target.checked)} 
                disabled={isSelf} 
                style={{ width: 'auto', marginBottom: 0 }}
              />
              Usuário Ativo
            </label>
            {isSelf && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>(Você não pode inativar a si mesmo)</span>}
          </div>

          {error && (
            <div className="form-group full-width" style={{ color: 'var(--danger-color)', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <div className="modal-actions full-width" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
