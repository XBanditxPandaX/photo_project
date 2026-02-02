import { useEffect } from 'react';
import photoService from '../services/photoService';

function Lightbox({ photo, onClose, onNavigate }) {
  const imageUrl = photoService.getPhotoImageUrl(photo.id);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate('prev');
      } else if (e.key === 'ArrowRight') {
        onNavigate('next');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, onNavigate]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="lightbox-backdrop" onClick={handleBackdropClick}>
      <button className="lightbox-close" onClick={onClose}>
        &times;
      </button>

      <button
        className="lightbox-nav lightbox-prev"
        onClick={() => onNavigate('prev')}
      >
        &#8249;
      </button>

      <div className="lightbox-content">
        <img
          src={imageUrl}
          alt={photo.title}
          className="lightbox-image"
        />
        <div className="lightbox-info">
          <h2>{photo.title}</h2>
          {photo.description && <p>{photo.description}</p>}
        </div>
      </div>

      <button
        className="lightbox-nav lightbox-next"
        onClick={() => onNavigate('next')}
      >
        &#8250;
      </button>
    </div>
  );
}

export default Lightbox;
