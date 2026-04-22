import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, Image as ImageIcon } from 'lucide-react';
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
  const [tipo, setTipo] = useState<ServicePhotoType>('geral');
  const [legenda, setLegenda] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Por favor, selecione uma imagem válida.');
        return;
      }
      setFile(selectedFile);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setUploading(true);
    setError(null);

    try {
      // 1. Upload to Storage
      const { path, name } = await servicePhotoService.uploadPhoto(serviceId, file);

      // 2. Create record in DB
      await servicePhotoService.createPhotoRecord({
        servico_realizado_id: serviceId,
        tipo,
        bucket: 'servicos-fotos',
        caminho_arquivo: path,
        nome_arquivo: name,
        mime_type: file.type,
        tamanho_bytes: file.size,
        legenda: legenda.trim() || undefined,
        created_by: user.id
      });

      // 3. Success
      setFile(null);
      setPreview(null);
      setLegenda('');
      onUploadSuccess();
    } catch (err: any) {
      console.error('Erro no upload:', err);
      setError(err.message || 'Erro ao enviar a foto. Verifique sua conexão.');
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="photo-upload-container" style={{ 
      padding: '1.5rem', 
      borderRadius: '12px', 
      border: '1px dashed var(--border-color)',
      backgroundColor: 'rgba(255, 255, 255, 0.02)'
    }}>
      <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Upload size={18} color="var(--primary-gold)" />
        Adicionar Foto ao Serviço
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
          <ImageIcon size={40} strokeWidth={1} />
          <span>Clique para selecionar uma foto</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '200px', height: '150px' }}>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
            />
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
          </div>

          <div style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <select 
                value={tipo} 
                onChange={(e) => setTipo(e.target.value as ServicePhotoType)}
                style={{ width: '100%' }}
                disabled={uploading}
              >
                <option value="antes">Foto de ANTES</option>
                <option value="depois">Foto de DEPOIS</option>
                <option value="geral">Foto GERAL</option>
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
