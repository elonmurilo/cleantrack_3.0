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
