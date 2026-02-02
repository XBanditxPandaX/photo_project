import { useState, useEffect } from 'react';
import PhotoCard from './PhotoCard';
import Lightbox from './Lightbox';
import photoService from '../services/photoService';

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const data = await photoService.getAllPhotos();
      setPhotos(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des photos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseLightbox = () => {
    setSelectedPhoto(null);
  };

  const handleNavigate = (direction) => {
    if (!selectedPhoto) return;

    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    let newIndex;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    } else {
      newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedPhoto(photos[newIndex]);
  };

  if (loading) {
    return <div className="loading">Chargement des photos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (photos.length === 0) {
    return <div className="empty">Aucune photo disponible</div>;
  }

  return (
    <div className="gallery-container">
      <div className="gallery-grid">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onClick={() => handlePhotoClick(photo)}
          />
        ))}
      </div>

      {selectedPhoto && (
        <Lightbox
          photo={selectedPhoto}
          onClose={handleCloseLightbox}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}

export default Gallery;
