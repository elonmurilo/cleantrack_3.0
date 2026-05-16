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
      <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Usuário</h2>
          <button className="btn-close" onClick={onClose} aria-label="Fechar modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-group col-span-2">
              <label>E-mail (Login)</label>
              <input 
                type="email" 
                className="form-control"
                value={user.email} 
                disabled 
                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
                title="A alteração de e-mail não é permitida por aqui."
              />
            </div>

            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input 
                id="nome"
                type="text"
                className="form-control"
                value={nome} 
                onChange={e => setNome(e.target.value)} 
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="papel">Papel / Perfil</label>
              <select 
                id="papel" 
                className="form-control"
                value={papel} 
                onChange={e => setPapel(e.target.value as UserRole)}
              >
                <option value="admin">Administrador</option>
                <option value="gestor">Gestor</option>
                <option value="operador">Operador</option>
              </select>
            </div>

            <div className="form-group col-span-2" style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary, #f8fafc)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.25rem', cursor: isSelf ? 'not-allowed' : 'pointer' }}>
                  Status do Usuário
                </label>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {isSelf ? 'Você não pode inativar a si mesmo.' : 'Desativar impede o acesso ao sistema.'}
                </span>
              </div>
              
              <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: isSelf ? 'not-allowed' : 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={ativo} 
                  onChange={e => setAtivo(e.target.checked)} 
                  disabled={isSelf} 
                  className="toggle-checkbox"
                  style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary-gold)', cursor: isSelf ? 'not-allowed' : 'pointer' }}
                />
                <span style={{ marginLeft: '0.5rem', fontWeight: 500, color: ativo ? 'var(--text-dark)' : 'var(--text-muted)' }}>
                  {ativo ? 'Ativo' : 'Inativo'}
                </span>
              </label>
            </div>

            {error && (
              <div className="form-group col-span-2" style={{ color: 'var(--danger-color)', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}
          </div>

          <div className="modal-footer mt-6">
            <Button type="button" variant="action" onClick={onClose} disabled={loading} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-dark)' }}>
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
