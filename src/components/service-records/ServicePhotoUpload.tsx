import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, Image as ImageIcon, Film } from 'lucide-react';
import { servicePhotoService } from '../../services/servicePhotoService';
import { ServicePhotoType } from '../../types/servicePhoto';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

interface ServicePhotoUploadProps {
  serviceId: string;
  onUploadSuccess: () => void;
}

const ServicePhotoUpload: React.FC<ServicePhotoUploadProps> = ({ serviceId, onUploadSuccess }) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [tipo, setTipo] = useState<ServicePhotoType>('geral');
  const [legenda, setLegenda] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!servicePhotoService.isValidMime(selectedFile.type)) {
        setError('Formato não suportado. Aceitos: JPEG, PNG, WebP (fotos), MP4, WebM, MOV (vídeos).');
        return;
      }
      setFile(selectedFile);
      setError(null);

      const fileIsVideo = selectedFile.type.startsWith('video/');
      setIsVideo(fileIsVideo);

      if (fileIsVideo) {
        // Video preview via object URL
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        // Image preview via FileReader
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setUploading(true);
    setError(null);

    try {
      // 1. Upload to Storage (novo bucket servicos-midias)
      const { path, name, bucket } = await servicePhotoService.uploadMedia(serviceId, file);

      // 2. Detectar tipo de mídia
      const tipoMidia = servicePhotoService.detectMediaType(file.type);

      // 3. Create record in DB
      await servicePhotoService.createPhotoRecord({
        servico_realizado_id: serviceId,
        tipo,
        tipo_midia: tipoMidia,
        bucket,
        caminho_arquivo: path,
        nome_arquivo: name,
        mime_type: file.type,
        tamanho_bytes: file.size,
        legenda: legenda.trim() || undefined,
        created_by: user.id
      });

      // 4. Success - cleanup
      if (isVideo && preview) {
        URL.revokeObjectURL(preview);
      }
      setFile(null);
      setPreview(null);
      setIsVideo(false);
      setLegenda('');
      onUploadSuccess();
    } catch (err: any) {
      console.error('Erro no upload:', err);
      setError(err.message || 'Erro ao enviar o arquivo. Verifique sua conexão.');
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    if (isVideo && preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    setIsVideo(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const mediaTypeLabel = isVideo ? 'Vídeo' : 'Foto';

  return (
    <div className="photo-upload-container" style={{ 
      padding: '1.5rem', 
      borderRadius: '12px', 
      border: '1px dashed var(--border-color)',
      backgroundColor: 'rgba(255, 255, 255, 0.02)'
    }}>
      <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Upload size={18} color="var(--primary-gold)" />
        Adicionar Foto ou Vídeo
      </h4>

      {!preview ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          style={{ 
            height: '150px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            cursor: 'pointer',
            gap: '10px',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', gap: '1rem' }}>
            <ImageIcon size={36} strokeWidth={1} />
            <Film size={36} strokeWidth={1} />
          </div>
          <span>Clique para selecionar uma foto ou vídeo</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            JPEG, PNG, WebP, MP4, WebM, MOV
          </span>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept={servicePhotoService.ACCEPT_STRING}
            style={{ display: 'none' }} 
          />
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '200px', minHeight: '120px' }}>
            {isVideo ? (
              <video 
                src={preview} 
                controls
                style={{ width: '100%', maxHeight: '200px', borderRadius: '8px', backgroundColor: '#000' }} 
              />
            ) : (
              <img 
                src={preview} 
                alt="Preview" 
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} 
              />
            )}
            <button 
              onClick={clearSelection}
              style={{ 
                position: 'absolute', 
                top: '-10px', 
                right: '-10px', 
                background: 'var(--danger)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '50%', 
                width: '24px', 
                height: '24px', 
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <X size={14} />
            </button>

            {/* Badge indicando tipo de mídia */}
            <div style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              backgroundColor: isVideo ? 'rgba(0,122,255,0.85)' : 'rgba(52,199,89,0.85)',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {isVideo ? <Film size={10} /> : <ImageIcon size={10} />}
              {mediaTypeLabel}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <select 
                value={tipo} 
                onChange={(e) => setTipo(e.target.value as ServicePhotoType)}
                style={{ width: '100%' }}
                disabled={uploading}
              >
                <option value="antes">{mediaTypeLabel} de ANTES</option>
                <option value="depois">{mediaTypeLabel} de DEPOIS</option>
                <option value="geral">{mediaTypeLabel} GERAL</option>
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <input 
                type="text" 
                placeholder="Legenda (opcional)" 
                value={legenda}
                onChange={(e) => setLegenda(e.target.value)}
                disabled={uploading}
              />
            </div>

            {file && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <Button 
                onClick={handleUpload} 
                disabled={uploading}
                style={{ flex: 1 }}
              >
                {uploading ? 'Enviando...' : 'Confirmar Upload'}
              </Button>
              <Button 
                onClick={clearSelection} 
                disabled={uploading}
                style={{ 
                  backgroundColor: 'transparent', 
                  border: '1px solid #ddd', 
                  color: 'var(--text-muted)',
                  boxShadow: 'none',
                  padding: '0.8rem'
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.8rem', 
          borderRadius: '6px', 
          backgroundColor: 'rgba(255, 75, 75, 0.1)', 
          color: 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
};

export default ServicePhotoUpload;
