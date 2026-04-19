export type UserRole = 'admin' | 'operador' | 'visualizador';

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  papel: UserRole;
  ativo: boolean;
  created_at?: string;
  avatar_url?: string;
}
