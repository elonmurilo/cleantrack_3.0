import { supabase } from '../lib/supabase';
import { 
  ServicePhoto, 
  CreateServicePhotoPayload, 
  UpdateServicePhotoPayload 
} from '../types/servicePhoto';

const BUCKET_NAME = 'servicos-fotos';

export const servicePhotoService = {
  /**
   * Lista as fotos ativas de um serviço realizado
   */
  listPhotosByService: async (serviceId: string): Promise<ServicePhoto[]> => {
    const { data, error } = await supabase
      .from('servico_realizado_fotos')
      .select('*')
      .eq('servico_realizado_id', serviceId)
      .eq('ativo', true)
      .order('ordem', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erro ao listar fotos do serviço:', error);
      throw error;
    }

    return data as ServicePhoto[];
  },

  /**
   * Upload de arquivo para o Storage
   */
  uploadPhoto: async (serviceId: string, file: File): Promise<{ path: string; name: string }> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${serviceId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Erro ao fazer upload da foto:', uploadError);
      throw uploadError;
    }

    return { path: filePath, name: fileName };
  },

  /**
   * Registra metadados da foto no banco
   */
  createPhotoRecord: async (payload: CreateServicePhotoPayload): Promise<ServicePhoto> => {
    const { data, error } = await supabase
      .from('servico_realizado_fotos')
      .insert([payload])
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao criar registro da foto:', error);
      throw error;
    }

    return data as ServicePhoto;
  },

  /**
   * Atualiza metadados de uma foto
   */
  updatePhotoRecord: async (id: string, payload: UpdateServicePhotoPayload): Promise<ServicePhoto> => {
    const { data, error } = await supabase
      .from('servico_realizado_fotos')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao atualizar registro da foto:', error);
      throw error;
    }

    return data as ServicePhoto;
  },

  /**
   * Desativação lógica da foto
   */
  deactivatePhoto: async (id: string, userId: string): Promise<void> => {
    const { error } = await supabase
      .from('servico_realizado_fotos')
      .update({ ativo: false, updated_by: userId })
      .eq('id', id);

    if (error) {
      console.error('Erro ao desativar foto:', error);
      throw error;
    }
  },

  /**
   * Obtém a URL pública da foto
   */
  getPhotoPublicUrl: (path: string): string => {
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);

    return data.publicUrl;
  }
};
