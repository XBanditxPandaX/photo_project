import { useState } from 'react';
import photoService from '../services/photoService';

function AddPhotoModal({ isOpen, onClose, onPhotoAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'portrait'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await photoService.uploadPhoto(
        formData.title,
        formData.description,
        formData.imageUrl,
        formData.category
      );
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        category: 'portrait'
      });
      onPhotoAdded();
      onClose();
    } catch (err) {
      setError('Erreur lors de l\'ajout de la photo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Ajouter une photo</h2>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="category">Categorie</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="portrait">Portrait</option>
              <option value="mariage">Mariage</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Titre</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Titre de la photo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description de la photo (optionnel)"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">URL de l'image</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              placeholder="https://exemple.com/image.jpg"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Ajout en cours...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPhotoModal;
