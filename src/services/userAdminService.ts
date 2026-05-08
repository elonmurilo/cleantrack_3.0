import { supabase } from '../lib/supabase';
import { AdminUser, UpdateAdminUserPayload } from '../types/adminUser';

export const userAdminService = {
  getUsers: async (): Promise<AdminUser[]> => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  updateUser: async (id: string, payload: UpdateAdminUserPayload): Promise<AdminUser> => {
    const { data, error } = await supabase
      .from('usuarios')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
