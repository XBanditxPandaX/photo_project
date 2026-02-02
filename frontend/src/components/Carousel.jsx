import { useState, useRef } from 'react';

function Carousel({ title, photos, onPhotoClick, onViewMore }) {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  if (photos.length === 0) return null;

  return (
    <div className="carousel-section">
      <div className="carousel-header">
        <h2 className="carousel-title">{title}</h2>
        <button className="btn-view-more" onClick={onViewMore}>
          Voir plus
        </button>
      </div>
      <div className="carousel-wrapper">
        {canScrollLeft && (
          <button
            className="carousel-btn carousel-btn-left"
            onClick={() => scroll('left')}
          >
            &#8249;
          </button>
        )}
        <div
          className="carousel-track"
          ref={carouselRef}
          onScroll={checkScrollButtons}
        >
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="carousel-item"
              onClick={() => onPhotoClick(photo)}
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                loading="lazy"
              />
              <div className="carousel-item-overlay">
                <span>{photo.title}</span>
              </div>
            </div>
          ))}
        </div>
        {canScrollRight && photos.length > 3 && (
          <button
            className="carousel-btn carousel-btn-right"
            onClick={() => scroll('right')}
          >
            &#8250;
          </button>
        )}
      </div>
    </div>
  );
}

export default Carousel;
