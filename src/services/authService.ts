import { mockData } from '../data/mockData';
import { User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simular validação básica
    if (email === "contato@cleantrack.com" && password === "123456") {
      return mockData.currentUser;
    }
    throw new Error("Credenciais inválidas");
  },

  getCurrentUser: (): User | null => {
    // Para o MVP inicial, podemos retornar o usuário do mock
    return mockData.currentUser;
  },

  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Lógica de logout futuramente com Supabase
  }
};
