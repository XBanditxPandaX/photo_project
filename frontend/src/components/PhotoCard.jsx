import photoService from '../services/photoService';

function PhotoCard({ photo, onClick }) {
  const imageUrl = photoService.getPhotoImageUrl(photo.id);

  return (
    <div className="photo-card" onClick={onClick}>
      <div className="photo-card-image">
        <img
          src={imageUrl}
          alt={photo.title}
          loading="lazy"
        />
      </div>
      <div className="photo-card-overlay">
        <h3 className="photo-card-title">{photo.title}</h3>
      </div>
    </div>
  );
}

export default PhotoCard;
