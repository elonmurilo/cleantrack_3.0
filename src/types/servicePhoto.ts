export type ServicePhotoType = 'antes' | 'depois' | 'geral';

export interface ServicePhoto {
  id: string;
  servico_realizado_id: string;
  tipo: ServicePhotoType;
  bucket: string;
  caminho_arquivo: string;
  nome_arquivo: string;
  mime_type: string;
  tamanho_bytes: number;
  ordem: number;
  legenda?: string;
  ativo: boolean;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateServicePhotoPayload {
  servico_realizado_id: string;
  tipo: ServicePhotoType;
  bucket: string;
  caminho_arquivo: string;
  nome_arquivo: string;
  mime_type: string;
  tamanho_bytes: number;
  ordem?: number;
  legenda?: string;
  ativo?: boolean;
  created_by: string;
}

export interface UpdateServicePhotoPayload {
  tipo?: ServicePhotoType;
  ordem?: number;
  legenda?: string;
  ativo?: boolean;
  updated_by: string;
}
