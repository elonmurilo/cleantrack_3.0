import React, { useEffect, useState, useCallback } from 'react';
import { Trash2, MessageSquare, Image as ImageIcon, Film } from 'lucide-react';
import { ServicePhoto } from '../../types/servicePhoto';
import { servicePhotoService } from '../../services/servicePhotoService';
import { useAuth } from '../../hooks/useAuth';

interface ServicePhotoGalleryProps {
  serviceId: string;
  refreshTrigger: number;
}

/** Cache de signed URLs para evitar re-geração durante a mesma sessão */
const urlCache = new Map<string, { url: string; expires: number }>();

const ServicePhotoGallery: React.FC<ServicePhotoGalleryProps> = ({ serviceId, refreshTrigger }) => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<ServicePhoto[]>([]);
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchPhotos = useCallback(async () => {
    if (!serviceId) return;
    setLoading(true);
    try {
      const data = await servicePhotoService.listPhotosByService(serviceId);
      setPhotos(data);

      // Resolver signed URLs para todas as mídias
      const urls: Record<string, string> = {};
      await Promise.all(
        data.map(async (media) => {
          const cacheKey = `${media.bucket}/${media.caminho_arquivo}`;
          const cached = urlCache.get(cacheKey);
          
          // Usar cache se ainda válido (com margem de 5 min)
          if (cached && cached.expires > Date.now() + 300000) {
            urls[media.id] = cached.url;
            return;
          }

          try {
            const url = await servicePhotoService.getMediaSignedUrl(media.caminho_arquivo, media.bucket);
            urls[media.id] = url;
            urlCache.set(cacheKey, { url, expires: Date.now() + 3600000 });
          } catch (err) {
            console.error(`Erro ao gerar URL para mídia ${media.id}:`, err);
            urls[media.id] = '';
          }
        })
      );
      setMediaUrls(urls);
    } catch (error) {
      console.error('Erro ao buscar mídias:', error);
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos, refreshTrigger]);

  const handleDeactivate = async (mediaId: string, isVideo: boolean) => {
    if (!user) return;
    const label = isVideo ? 'vídeo' : 'foto';
    if (window.confirm(`Deseja remover esta ${label} da galeria?`)) {
      try {
        await servicePhotoService.deactivatePhoto(mediaId, user.id);
        // Limpar cache da URL removida
        const media = photos.find(p => p.id === mediaId);
        if (media) {
          urlCache.delete(`${media.bucket}/${media.caminho_arquivo}`);
        }
        fetchPhotos();
      } catch (error) {
        console.error('Erro ao desativar mídia:', error);
        alert(`Erro ao remover ${label}.`);
      }
    }
  };

  const groupedPhotos = {
    antes: photos.filter(p => p.tipo === 'antes'),
    depois: photos.filter(p => p.tipo === 'depois'),
    geral: photos.filter(p => p.tipo === 'geral'),
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando mídias...</div>;
  }

  /**
   * Verifica se um registro é vídeo.
   * Suporta registros antigos que não possuem tipo_midia (fallback para mime_type).
   */
  const isVideoMedia = (media: ServicePhoto): boolean => {
    if (media.tipo_midia) return media.tipo_midia === 'video';
    return media.mime_type?.startsWith('video/') || false;
  };

  const renderMediaItem = (media: ServicePhoto) => {
    const mediaIsVideo = isVideoMedia(media);
    const url = mediaUrls[media.id] || '';

    if (!url) {
      return (
        <div key={media.id} style={{ 
          borderRadius: '8px', 
          backgroundColor: 'rgba(0,0,0,0.03)', 
          height: '120px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.75rem'
        }}>
          Carregando...
        </div>
      );
    }

    return (
      <div key={media.id} className="photo-card" style={{ 
        position: 'relative', 
        borderRadius: '8px', 
        overflow: 'hidden', 
        backgroundColor: 'rgba(255,255,255,0.05)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        {mediaIsVideo ? (
          <video 
            src={url}
            controls
            preload="metadata"
            style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block', backgroundColor: '#000' }}
          />
        ) : (
          <img 
            src={url} 
            alt={media.legenda || 'Foto do serviço'} 
            style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} 
          />
        )}

        {/* Badge de tipo de mídia */}
        <div style={{
          position: 'absolute',
          top: '6px',
          left: '6px',
          backgroundColor: mediaIsVideo ? 'rgba(0,122,255,0.85)' : 'rgba(52,199,89,0.85)',
          color: 'white',
          fontSize: '0.65rem',
          fontWeight: 600,
          padding: '2px 6px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          pointerEvents: 'none'
        }}>
          {mediaIsVideo ? <Film size={9} /> : <ImageIcon size={9} />}
          {mediaIsVideo ? 'Vídeo' : 'Foto'}
        </div>
        
        <div style={{ padding: '0.5rem' }}>
          {media.legenda && (
            <p style={{ 
              fontSize: '0.75rem', 
              margin: 0, 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              color: 'var(--text-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <MessageSquare size={10} />
              {media.legenda}
            </p>
          )}
          <button 
            onClick={() => handleDeactivate(media.id, mediaIsVideo)}
            style={{ 
              marginTop: '0.5rem', 
              background: 'none', 
              border: 'none', 
              color: 'var(--danger)', 
              cursor: 'pointer',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: 0
            }}
          >
            <Trash2 size={12} /> Remover
          </button>
        </div>
      </div>
    );
  };

  const renderSection = (title: string, mediaList: ServicePhoto[], color: string) => {
    const fotoCount = mediaList.filter(m => !isVideoMedia(m)).length;
    const videoCount = mediaList.filter(m => isVideoMedia(m)).length;
    
    const countParts: string[] = [];
    if (fotoCount > 0) countParts.push(`${fotoCount} foto${fotoCount > 1 ? 's' : ''}`);
    if (videoCount > 0) countParts.push(`${videoCount} vídeo${videoCount > 1 ? 's' : ''}`);
    const countLabel = countParts.length > 0 ? countParts.join(', ') : '0';

    return (
      <div style={{ marginBottom: '2rem' }}>
        <h5 style={{ 
          margin: '0 0 1rem 0', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          color: color,
          borderBottom: `1px solid ${color}33`,
          paddingBottom: '0.5rem'
        }}>
          {title} ({countLabel})
        </h5>
        
        {mediaList.length === 0 ? (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Nenhuma mídia nesta categoria.
          </p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
            gap: '1rem' 
          }}>
            {mediaList.map(renderMediaItem)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="service-photo-gallery">
      {renderSection('Antes do Serviço', groupedPhotos.antes, '#FFA500')}
      {renderSection('Depois do Serviço', groupedPhotos.depois, '#34C759')}
      {renderSection('Mídias Gerais', groupedPhotos.geral, 'var(--text-muted)')}
    </div>
  );
};

export default ServicePhotoGallery;
