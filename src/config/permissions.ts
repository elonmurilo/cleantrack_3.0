import { UserRole } from '../types/user';

export type AppModule = 
  | 'dashboard'
  | 'clientes'
  | 'agendamentos'
  | 'servicos'
  | 'fotos'
  | 'financeiro'
  | 'usuarios'
  | 'configuracoes'
  | 'relatorios'
  | 'monitoramento';

export const rolePermissions: Record<UserRole, AppModule[]> = {
  admin: [
    'dashboard',
    'clientes',
    'agendamentos',
    'servicos',
    'fotos',
    'financeiro',
    'usuarios',
    'configuracoes',
    'relatorios',
    'monitoramento'
  ],
  gestor: [
    'dashboard',
    'clientes',
    'agendamentos',
    'servicos',
    'fotos',
    'financeiro',
    'relatorios',
    'monitoramento'
  ],
  operador: [
    'clientes',
    'agendamentos',
    'servicos',
    'fotos',
    'monitoramento'
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
