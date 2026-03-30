import { useState, useEffect, useMemo } from 'react';
import Carousel from './Carousel';
import CategoryView from './CategoryView';
import Lightbox from './Lightbox';
import photoService from '../services/photoService';
import { isAdmin } from '../services/authService';
import { useNavigate } from 'react-router';

const CATEGORIES = {
  portrait: {
    name: 'Portraits',
    subtitle: 'Des visages qui racontent une stratégie émotionnelle'
  },
  mariage: {
    name: 'Mariages',
    subtitle: 'Des instants sincères cadrés comme des souvenirs premium'
  }
};

const BULLSHIT_PHRASES = [
  'Chaque image optimise l’authenticité perçue en temps réel.',
  'Ici, la lumière devient un levier narratif à haute valeur émotionnelle.',
  'Le cadrage transforme vos moments en expérience visuelle scalable.'
];

function Gallery() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
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
      {isAdmin() && (
        <button className="btn-add-photo" onClick={() => navigate('/admin/photos/new')}>
          + Ajouter une photo
        </button>
      )}

      <section className="vibe-board">
        <p className="vibe-intro">Notre manifeste créatif du moment</p>
        <div className="vibe-grid">
          {BULLSHIT_PHRASES.map((phrase) => (
            <p key={phrase} className="vibe-pill">{phrase}</p>
          ))}
        </div>
      </section>

      {photos.length === 0 ? (
        <div className="empty">Aucune photo disponible</div>
      ) : selectedCategory ? (
        <CategoryView
          title={CATEGORIES[selectedCategory].name}
          subtitle={CATEGORIES[selectedCategory].subtitle}
          photos={photosByCategory[selectedCategory]}
          onPhotoClick={handlePhotoClick}
          onBack={handleBackToCarousels}
        />
      ) : (
        <div className="carousels-container">
          {Object.entries(CATEGORIES).map(([categoryKey, categoryData]) => (
            <Carousel
              key={categoryKey}
              title={categoryData.name}
              subtitle={categoryData.subtitle}
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
    </div>
  );
}

export default Gallery;
