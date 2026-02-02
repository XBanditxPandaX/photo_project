function CategoryView({ title, photos, onPhotoClick, onBack }) {
  return (
    <div className="category-view">
      <div className="category-view-header">
        <button className="btn-back" onClick={onBack}>
          &#8592; Retour
        </button>
        <h2 className="category-view-title">{title}</h2>
      </div>

      {photos.length === 0 ? (
        <div className="empty">Aucune photo dans cette categorie</div>
      ) : (
        <div className="category-grid">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="category-item"
              onClick={() => onPhotoClick(photo)}
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                loading="lazy"
              />
              <div className="category-item-overlay">
                <span>{photo.title}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryView;
