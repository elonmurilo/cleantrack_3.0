import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { authService } from '../services/authService';
import { UserProfile } from '../types/user';
import { AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    loading: true,
  });

  const loadProfile = async (session: Session | null) => {
    if (!session?.user) {
      setState(prev => ({ ...prev, session: null, user: null, profile: null, loading: false }));
      return;
    }

    try {
      const profile = await authService.getUserProfile(session.user.id);
      
      // Se não tiver perfil ou estiver inativo, tratamos como não autenticado para o app
      if (!profile || !profile.ativo) {
        if (profile && !profile.ativo) {
          console.warn('Usuário inativo tentou acessar.');
        }
        setState(prev => ({ 
          ...prev, 
          session, 
          user: session.user, 
          profile: null, 
          loading: false 
        }));
        return;
      }

      setState({
        session,
        user: session.user,
        profile,
        loading: false,
      });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    // Busca inicial de sessão
    authService.getSession().then(session => {
      loadProfile(session);
    });

    // Escuta mudanças de auth
    const subscription = authService.onAuthStateChange((session) => {
      loadProfile(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { session } = await authService.signIn(email, password);
    
    // Validar perfil antes de carregar o estado
    if (session?.user) {
      try {
        const profile = await authService.getUserProfile(session.user.id);
        
        if (!profile) {
          throw new Error('Registro não encontrado.');
        }
        
        if (!profile.ativo) {
          throw new Error('Sua conta está inativa. Contate o administrador.');
        }

        if (!['admin', 'gestor', 'operador'].includes(profile.papel)) {
          throw new Error('Papel inválido: Seu perfil de acesso não foi configurado corretamente.');
        }
      } catch (err: any) {
        await authService.signOut();
        
        // Tratar erro PGRST116 (Nenhum registro retornado - pode ser RLS ou ausência real)
        if (err.code === 'PGRST116') {
          throw new Error('Registro não encontrado. O perfil não existe ou o RLS está bloqueando a leitura.');
        }
        
        // Propagar nossos próprios erros mapeados
        if (['Registro não encontrado.', 'Sua conta está inativa. Contate o administrador.', 'Papel inválido: Seu perfil de acesso não foi configurado corretamente.'].includes(err.message)) {
          throw err;
        }

        // Erro genérico de consulta/banco
        console.error('Erro de consulta ao buscar perfil:', err);
        throw new Error(`Erro de consulta/RLS: ${err.message || JSON.stringify(err)}`);
      }
    }

    await loadProfile(session);
  };

  const signOut = async () => {
    await authService.signOut();
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
