import { supabase } from '../lib/supabase';
import { UserProfile } from '../types/user';
import { AuthError, Session, User } from '@supabase/supabase-js';

export const authService = {
  /**
   * Realiza login com email e senha
   */
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Realiza logout
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Obtém a sessão atual
   */
  getSession: async (): Promise<Session | null> => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  /**
   * Obtém o perfil do usuário na tabela pública 'usuarios'
   */
  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil:', error.message);
      return null;
    }

    return data as UserProfile;
  },

  /**
   * Listener para mudanças no estado de autenticação
   */
  onAuthStateChange: (callback: (session: Session | null) => void) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });

    return subscription;
  }
};
