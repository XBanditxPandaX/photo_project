import photoService from '../services/photoService';
import {useEffect, useState} from "react";

function PhotoCard({ photo, onClick }) {
    const [imageUrl, setImageUrl] = useState();

    useEffect(() => {
        void getImageUrl();
    }, [])

    const getImageUrl = async () => {
        const image = await photoService.getPhotoById(photo.id);
        setImageUrl(image.imageUrl)
    }

  return (
    <div className="photo-card" onClick={onClick}>
      <div className="photo-card-image">
          {
              imageUrl
                  ? <img
                      src={imageUrl}
                      alt={photo.title}
                      loading="lazy"
                  />
                  : "Loading..."
          }
      </div>
      <div className="photo-card-overlay">
        <h3 className="photo-card-title">{photo.title}</h3>
      </div>
    </div>
  );
}

export default PhotoCard;
