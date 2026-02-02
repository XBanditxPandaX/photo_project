import { useState, useEffect, useMemo } from 'react';
import Carousel from './Carousel';
import CategoryView from './CategoryView';
import Lightbox from './Lightbox';
import AddPhotoModal from './AddPhotoModal';
import photoService from '../services/photoService';

const CATEGORIES = {
  portrait: 'Portraits',
  mariage: 'Mariages'
};

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const photosByCategory = useMemo(() => {
    const grouped = {};
    Object.keys(CATEGORIES).forEach(cat => {
      grouped[cat] = photos.filter(p => p.category === cat);
    });
    return grouped;
  }, [photos]);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleCloseLightbox = () => {
    setSelectedPhoto(null);
  };

  const handleNavigate = (direction) => {
    if (!selectedPhoto) return;

    const currentPhotos = selectedCategory
      ? photosByCategory[selectedCategory]
      : photos;

    const currentIndex = currentPhotos.findIndex(p => p.id === selectedPhoto.id);
    let newIndex;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : currentPhotos.length - 1;
    } else {
      newIndex = currentIndex < currentPhotos.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedPhoto(currentPhotos[newIndex]);
  };

  const handleViewMore = (categoryKey) => {
    setSelectedCategory(categoryKey);
  };

  const handleBackToCarousels = () => {
    setSelectedCategory(null);
  };

  if (loading) {
    return <div className="loading">Chargement des photos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="gallery-container">
      <button className="btn-add-photo" onClick={() => setIsModalOpen(true)}>
        + Ajouter une photo
      </button>

      {photos.length === 0 ? (
        <div className="empty">Aucune photo disponible</div>
      ) : selectedCategory ? (
        <CategoryView
          title={CATEGORIES[selectedCategory]}
          photos={photosByCategory[selectedCategory]}
          onPhotoClick={handlePhotoClick}
          onBack={handleBackToCarousels}
        />
      ) : (
        <div className="carousels-container">
          {Object.entries(CATEGORIES).map(([categoryKey, categoryTitle]) => (
            <Carousel
              key={categoryKey}
              title={categoryTitle}
              photos={photosByCategory[categoryKey]}
              onPhotoClick={handlePhotoClick}
              onViewMore={() => handleViewMore(categoryKey)}
            />
          ))}
        </div>
      )}

      {selectedPhoto && (
        <Lightbox
          photo={selectedPhoto}
          onClose={handleCloseLightbox}
          onNavigate={handleNavigate}
        />
      )}

      <AddPhotoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPhotoAdded={loadPhotos}
      />
    </div>
  );
}

export default Gallery;
