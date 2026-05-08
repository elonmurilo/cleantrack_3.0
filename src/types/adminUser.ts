import { UserRole, UserProfile } from './user';

export interface AdminUser extends UserProfile {
  updated_at?: string;
  ultimo_login_em?: string;
}

export interface UpdateAdminUserPayload {
  nome?: string;
  papel?: UserRole;
  ativo?: boolean;
}
