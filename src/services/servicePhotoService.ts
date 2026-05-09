import { supabase } from '../lib/supabase';
import { 
  ServicePhoto, 
  CreateServicePhotoPayload, 
  UpdateServicePhotoPayload,
  ServiceMediaType
} from '../types/servicePhoto';

/** Bucket obrigatório para novos uploads (fotos e vídeos) */
const UPLOAD_BUCKET = 'servicos-midias';

/** Tempo de expiração das signed URLs em segundos (1 hora) */
const SIGNED_URL_EXPIRY = 3600;

/** MIMEs aceitos para cada tipo de mídia */
const ACCEPTED_MIMES: Record<ServiceMediaType, string[]> = {
  foto: ['image/jpeg', 'image/png', 'image/webp'],
  video: ['video/mp4', 'video/webm', 'video/quicktime']
};

/** Todos os MIMEs aceitos */
const ALL_ACCEPTED_MIMES = [...ACCEPTED_MIMES.foto, ...ACCEPTED_MIMES.video];

/**
 * Detecta o tipo de mídia a partir do MIME type do arquivo.
 */
const detectMediaType = (mimeType: string): ServiceMediaType => {
  if (ACCEPTED_MIMES.video.includes(mimeType)) return 'video';
  return 'foto';
};

/**
 * Valida se o MIME type é aceito pelo sistema.
 */
const isValidMime = (mimeType: string): boolean => {
  return ALL_ACCEPTED_MIMES.includes(mimeType);
};

export const servicePhotoService = {
  /**
   * Lista as mídias ativas de um serviço realizado
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
      console.error('Erro ao listar mídias do serviço:', error);
      throw error;
    }

    return data as ServicePhoto[];
  },

  /**
   * Upload de arquivo (foto ou vídeo) para o Storage.
   * Sempre usa o bucket 'servicos-midias'. Sem fallback.
   */
  uploadMedia: async (serviceId: string, file: File): Promise<{ path: string; name: string; bucket: string }> => {
    if (!isValidMime(file.type)) {
      throw new Error(
        `Tipo de arquivo não suportado: ${file.type}. ` +
        `Formatos aceitos: JPEG, PNG, WebP (fotos), MP4, WebM, MOV (vídeos).`
      );
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${serviceId}/${fileName}`;

    console.log(`[Upload] Bucket: "${UPLOAD_BUCKET}" | Caminho: "${filePath}" | MIME: ${file.type} | Tamanho: ${file.size} bytes`);

    const { error: uploadError } = await supabase.storage
      .from(UPLOAD_BUCKET)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error(`[Upload ERRO] Bucket: "${UPLOAD_BUCKET}" | Caminho: "${filePath}" | Erro:`, uploadError);
      throw uploadError;
    }

    console.log(`[Upload OK] Bucket: "${UPLOAD_BUCKET}" | Caminho: "${filePath}"`);
    return { path: filePath, name: fileName, bucket: UPLOAD_BUCKET };
  },

  /**
   * Registra metadados da mídia no banco
   */
  createPhotoRecord: async (payload: CreateServicePhotoPayload): Promise<ServicePhoto> => {
    const { data, error } = await supabase
      .from('servico_realizado_fotos')
      .insert([payload])
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao criar registro da mídia:', error);
      throw error;
    }

    return data as ServicePhoto;
  },

  /**
   * Atualiza metadados de uma mídia
   */
  updatePhotoRecord: async (id: string, payload: UpdateServicePhotoPayload): Promise<ServicePhoto> => {
    const { data, error } = await supabase
      .from('servico_realizado_fotos')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao atualizar registro da mídia:', error);
      throw error;
    }

    return data as ServicePhoto;
  },

  /**
   * Desativação lógica da mídia
   */
  deactivatePhoto: async (id: string, userId: string): Promise<void> => {
    const { error } = await supabase
      .from('servico_realizado_fotos')
      .update({ ativo: false, updated_by: userId })
      .eq('id', id);

    if (error) {
      console.error('Erro ao desativar mídia:', error);
      throw error;
    }
  },

  /**
   * Obtém uma signed URL para exibição de mídia em bucket privado.
   * Respeita o bucket salvo no registro para compatibilidade com registros antigos.
   */
  getMediaSignedUrl: async (path: string, bucket: string): Promise<string> => {
    console.log(`[SignedURL] Bucket: "${bucket}" | Caminho: "${path}"`);

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, SIGNED_URL_EXPIRY);

    if (error) {
      console.error(`[SignedURL ERRO] Bucket: "${bucket}" | Caminho: "${path}" | Erro:`, error);
      // Fallback: tentar construir URL pública (funciona se bucket ou policy permitir)
      const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      return publicData.publicUrl;
    }

    return data.signedUrl;
  },

  /** Helper: detecta tipo de mídia pelo MIME */
  detectMediaType,

  /** Helper: verifica se MIME é válido */
  isValidMime,

  /** String de accept para o input file */
  ACCEPT_STRING: ALL_ACCEPTED_MIMES.join(',')
};
