import { UserRole } from '../types/user';

export type AppModule = 
  | 'dashboard'
  | 'clientes'
  | 'agendamentos'
  | 'servicos'
  | 'fotos'
  | 'financeiro'
  | 'usuarios'
  | 'configuracoes';

export const rolePermissions: Record<UserRole, AppModule[]> = {
  admin: [
    'dashboard',
    'clientes',
    'agendamentos',
    'servicos',
    'fotos',
    'financeiro',
    'usuarios',
    'configuracoes'
  ],
  gestor: [
    'dashboard',
    'clientes',
    'agendamentos',
    'servicos',
    'fotos',
    'financeiro'
  ],
  operador: [
    'clientes',
    'agendamentos',
    'servicos',
    'fotos'
  ]
};

export const hasPermission = (role: UserRole | undefined, module: AppModule): boolean => {
  if (!role) return false;
  return rolePermissions[role].includes(module);
};

export const getDefaultRoute = (role: UserRole | undefined): string => {
  if (!role) return '/login';
  
  switch (role) {
    case 'admin':
    case 'gestor':
      return '/dashboard';
    case 'operador':
      return '/agendamentos'; // Conforme decisão do usuário
    default:
      return '/login';
  }
};
