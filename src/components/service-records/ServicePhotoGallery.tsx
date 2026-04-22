import React, { useEffect, useState, useCallback } from 'react';
import { Trash2, MessageSquare } from 'lucide-react';
import { ServicePhoto } from '../../types/servicePhoto';
import { servicePhotoService } from '../../services/servicePhotoService';
import { useAuth } from '../../hooks/useAuth';

interface ServicePhotoGalleryProps {
  serviceId: string;
  refreshTrigger: number;
}

const ServicePhotoGallery: React.FC<ServicePhotoGalleryProps> = ({ serviceId, refreshTrigger }) => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<ServicePhoto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = useCallback(async () => {
    if (!serviceId) return;
    setLoading(true);
    try {
      const data = await servicePhotoService.listPhotosByService(serviceId);
      setPhotos(data);
    } catch (error) {
      console.error('Erro ao buscar fotos:', error);
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos, refreshTrigger]);

  const handleDeactivate = async (photoId: string) => {
    if (!user) return;
    if (window.confirm('Deseja remover esta foto da galeria?')) {
      try {
        await servicePhotoService.deactivatePhoto(photoId, user.id);
        fetchPhotos();
      } catch (error) {
        console.error('Erro ao desativar foto:', error);
        alert('Erro ao remover foto.');
      }
    }
  };

  const groupedPhotos = {
    antes: photos.filter(p => p.tipo === 'antes'),
    depois: photos.filter(p => p.tipo === 'depois'),
    geral: photos.filter(p => p.tipo === 'geral'),
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando fotos...</div>;
  }

  const renderSection = (title: string, photosList: ServicePhoto[], color: string) => (
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
        {title} ({photosList.length})
      </h5>
      
      {photosList.length === 0 ? (
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Nenhuma foto nesta categoria.
        </p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
          gap: '1rem' 
        }}>
          {photosList.map(photo => (
            <div key={photo.id} className="photo-card" style={{ 
              position: 'relative', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              backgroundColor: 'rgba(255,255,255,0.05)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <img 
                src={servicePhotoService.getPhotoPublicUrl(photo.caminho_arquivo)} 
                alt={photo.legenda || 'Foto do serviço'} 
                style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} 
              />
              
              <div style={{ padding: '0.5rem' }}>
                {photo.legenda && (
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
                    {photo.legenda}
                  </p>
                )}
                <button 
                  onClick={() => handleDeactivate(photo.id)}
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
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="service-photo-gallery">
      {renderSection('Antes do Serviço', groupedPhotos.antes, '#FFA500')}
      {renderSection('Depois do Serviço', groupedPhotos.depois, '#34C759')}
      {renderSection('Fotos Gerais', groupedPhotos.geral, 'var(--text-muted)')}
    </div>
  );
};

export default ServicePhotoGallery;
