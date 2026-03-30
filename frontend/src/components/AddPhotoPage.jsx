import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import photoService from '../services/photoService';
import { isAdmin, isAuthenticated, syncCurrentUser } from '../services/authService';

const INITIAL_FORM = {
  title: '',
  description: '',
  imageUrl: '',
  category: 'portrait',
};

const ADMIN_TABS = [
  {
    id: 'add-photo',
    label: 'Ajout photo',
    description: 'Publier une nouvelle image',
    to: '/admin/photos/new',
  },
  {
    id: 'gallery',
    label: 'Galerie',
    description: 'Modifier et supprimer',
    to: '/admin/gallery',
  },
];

function emptyEditState() {
  return {
    id: null,
    title: '',
    description: '',
    imageUrl: '',
    category: 'portrait',
  };
}

function AddPhotoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isGalleryTab = location.pathname === '/admin/gallery';
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState('');
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('all');
  const [editData, setEditData] = useState(emptyEditState());
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  useEffect(() => {
    let active = true;

    async function checkAccess() {
      if (!isAuthenticated()) {
        navigate('/auth');
        return;
      }

      try {
        await syncCurrentUser();
        if (!active) {
          return;
        }
        setHasAccess(isAdmin());
      } catch (err) {
        if (!active) {
          return;
        }
        setError(err.message);
        setHasAccess(false);
      } finally {
        if (active) {
          setCheckingAccess(false);
        }
      }
    }

    checkAccess();

    return () => {
      active = false;
    };
  }, [navigate]);

  useEffect(() => {
    if (!hasAccess || !isGalleryTab) {
      return;
    }

    loadPhotos();
  }, [hasAccess, isGalleryTab]);

  const galleryCountLabel = useMemo(() => {
    const count = galleryCategoryFilter === 'all'
      ? photos.length
      : photos.filter((photo) => photo.category === galleryCategoryFilter).length;

    if (count <= 1) {
      return `${count} photo`;
    }
    return `${count} photos`;
  }, [galleryCategoryFilter, photos]);

  const filteredPhotos = useMemo(() => {
    if (galleryCategoryFilter === 'all') {
      return photos;
    }

    return photos.filter((photo) => photo.category === galleryCategoryFilter);
  }, [galleryCategoryFilter, photos]);

  async function loadPhotos() {
    try {
      setGalleryLoading(true);
      const data = await photoService.getAllPhotos();
      setPhotos(data);
      setGalleryError('');
    } catch (err) {
      setGalleryError("Impossible de charger la galerie admin.");
    } finally {
      setGalleryLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await photoService.uploadPhoto(
        formData.title,
        formData.description,
        formData.imageUrl,
        formData.category
      );
      setFormData(INITIAL_FORM);
      navigate('/admin/gallery');
    } catch (err) {
      setError(err.message || "Erreur lors de l'ajout de la photo.");
    } finally {
      setLoading(false);
    }
  }

  function startEditing(photo) {
    setEditData({
      id: photo.id,
      title: photo.title ?? '',
      description: photo.description ?? '',
      imageUrl: photo.imageUrl ?? '',
      category: photo.category ?? 'portrait',
    });
    setGalleryError('');
  }

  function handleEditChange(event) {
    const { name, value } = event.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetEdit() {
    setEditData(emptyEditState());
  }

  function handleGalleryFilterChange(event) {
    setGalleryCategoryFilter(event.target.value);
  }

  async function handleEditSubmit(event) {
    event.preventDefault();
    setEditLoading(true);
    setGalleryError('');

    try {
      const updatedPhoto = await photoService.updatePhoto(editData.id, {
        title: editData.title,
        description: editData.description,
        imageUrl: editData.imageUrl,
        category: editData.category,
      });

      setPhotos((prev) => prev.map((photo) => (
        photo.id === updatedPhoto.id ? updatedPhoto : photo
      )));
      resetEdit();
    } catch (err) {
      setGalleryError(err.message || "Impossible de modifier la photo.");
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete(id) {
    setDeleteLoadingId(id);
    setGalleryError('');

    try {
      await photoService.deletePhoto(id);
      setPhotos((prev) => prev.filter((photo) => photo.id !== id));
      if (editData.id === id) {
        resetEdit();
      }
    } catch (err) {
      setGalleryError(err.message || "Impossible de supprimer la photo.");
    } finally {
      setDeleteLoadingId(null);
    }
  }

  if (checkingAccess) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Administration</h1>
          <p className="add-photo-intro">Verification des droits d&apos;acces...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Acces refuse</h1>
          <p className="add-photo-intro">Cette page est reservee a l&apos;administrateur.</p>
          {error && <p className="auth-error">{error}</p>}
          <p className="auth-back">
            <Link to="/">Retour a la galerie</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-photo-page">
      <div className="add-photo-shell admin-shell">
        <aside className="admin-sidebar">
            <p className="auth-back">
                <Link to="/">Retour a la galerie</Link>
            </p>
          <div className="admin-sidebar-card">
            <p className="add-photo-kicker">Administration</p>
            <h1 className="admin-sidebar-title">Espace admin</h1>
            <p className="admin-sidebar-copy">
              Un panneau unique pour piloter les contenus sans casser l&apos;identite visuelle de la galerie.
            </p>
          </div>

          <nav className="admin-nav" aria-label="Navigation administration">
            {ADMIN_TABS.map((tab) => (
              tab.enabled === false ? (
                <div key={tab.id} className="admin-nav-item admin-nav-item--disabled" aria-disabled="true">
                  <span className="admin-nav-label">{tab.label}</span>
                  <span className="admin-nav-copy">{tab.description}</span>
                  <span className="admin-nav-soon">Bientot</span>
                </div>
              ) : (
                <NavLink
                  key={tab.id}
                  to={tab.to}
                  className={({ isActive }) => `admin-nav-item${isActive ? ' admin-nav-item--active' : ''}`}
                >
                  <span className="admin-nav-label">{tab.label}</span>
                  <span className="admin-nav-copy">{tab.description}</span>
                </NavLink>
              )
            ))}
          </nav>
        </aside>

        <section className="admin-content">
          {isGalleryTab ? (
            <>
              <div className="add-photo-header">
                <p className="add-photo-kicker">Galerie</p>
                <h2 className="add-photo-title">Modifier ou supprimer une photo</h2>
                <p className="add-photo-intro">
                  {galleryCountLabel} disponibles dans la galerie. Choisis une photo pour la modifier ou retire-la.
                </p>
              </div>

              <div className="add-photo-panel admin-gallery-filter">
                <div className="form-group">
                  <label htmlFor="gallery-category-filter">Filtrer par categorie</label>
                  <select
                    id="gallery-category-filter"
                    name="galleryCategoryFilter"
                    value={galleryCategoryFilter}
                    onChange={handleGalleryFilterChange}
                  >
                    <option value="all">Toutes les categories</option>
                    <option value="portrait">Portrait</option>
                    <option value="mariage">Mariage</option>
                  </select>
                </div>
              </div>

              {galleryError && <div className="auth-error">{galleryError}</div>}

              <div className="admin-gallery-layout">
                <div className="admin-gallery-list">
                  {galleryLoading ? (
                    <div className="add-photo-panel">Chargement de la galerie...</div>
                  ) : filteredPhotos.length === 0 ? (
                    <div className="add-photo-panel">Aucune photo a administrer.</div>
                  ) : (
                    filteredPhotos.map((photo) => (
                      <article key={photo.id} className="admin-photo-card">
                        <div className="admin-photo-card-media">
                          {photo.imageUrl ? (
                            <img src={photo.imageUrl} alt={photo.title} />
                          ) : (
                            <div className="admin-photo-card-placeholder">Sans image</div>
                          )}
                        </div>
                        <div className="admin-photo-card-body">
                          <p className="admin-photo-card-category">{photo.category}</p>
                          <h3 className="admin-photo-card-title">{photo.title}</h3>
                          <p className="admin-photo-card-description">
                            {photo.description || 'Aucune description'}
                          </p>
                          <div className="admin-photo-card-actions">
                            <button
                              type="button"
                              className="header-auth-btn"
                              onClick={() => startEditing(photo)}
                            >
                              Modifier
                            </button>
                            <button
                              type="button"
                              className="header-auth-btn header-auth-btn--logout"
                              onClick={() => handleDelete(photo.id)}
                              disabled={deleteLoadingId === photo.id}
                            >
                              {deleteLoadingId === photo.id ? 'Suppression...' : 'Supprimer'}
                            </button>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>

                <div className="add-photo-panel admin-edit-panel">
                  <p className="add-photo-kicker">Edition</p>
                  <h3 className="admin-edit-title">
                    {editData.id ? 'Modifier la photo selectionnee' : 'Selectionne une photo'}
                  </h3>
                  <p className="add-photo-intro">
                    {editData.id
                      ? 'Mets a jour les informations puis enregistre.'
                      : 'Clique sur “Modifier” dans la galerie pour ouvrir le formulaire.'}
                  </p>

                  {editData.id && (
                    <form className="add-photo-form" onSubmit={handleEditSubmit}>
                      <div className="form-group">
                        <label htmlFor="edit-category">Categorie</label>
                        <select
                          id="edit-category"
                          name="category"
                          value={editData.category}
                          onChange={handleEditChange}
                          required
                        >
                          <option value="portrait">Portrait</option>
                          <option value="mariage">Mariage</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="edit-title">Titre</label>
                        <input
                          id="edit-title"
                          name="title"
                          type="text"
                          value={editData.title}
                          onChange={handleEditChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="edit-description">Description</label>
                        <textarea
                          id="edit-description"
                          name="description"
                          rows="4"
                          value={editData.description}
                          onChange={handleEditChange}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="edit-imageUrl">URL de l&apos;image</label>
                        <input
                          id="edit-imageUrl"
                          name="imageUrl"
                          type="url"
                          value={editData.imageUrl}
                          onChange={handleEditChange}
                          required
                        />
                      </div>

                      <div className="add-photo-actions">
                        <button type="button" className="btn-cancel" onClick={resetEdit}>
                          Annuler
                        </button>
                        <button type="submit" className="btn-submit" disabled={editLoading}>
                          {editLoading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="add-photo-header">
                <p className="add-photo-kicker">Ajout photo</p>
                <h2 className="add-photo-title">Ajouter une nouvelle photo</h2>
                <p className="add-photo-intro">
                  Depuis cet onglet, tu peux publier une photo directement dans la galerie.
                </p>
              </div>

              <div className="add-photo-panel">
                {error && <div className="auth-error">{error}</div>}

                <form className="add-photo-form" onSubmit={handleSubmit}>
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
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Titre de la photo"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Description de la photo"
                      rows="4"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="imageUrl">URL de l&apos;image</label>
                    <input
                      id="imageUrl"
                      name="imageUrl"
                      type="url"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="https://exemple.com/image.jpg"
                      required
                    />
                  </div>

                  <div className="add-photo-actions">
                    <Link className="btn-cancel add-photo-cancel" to="/">
                      Retour galerie
                    </Link>
                    <button type="submit" className="btn-submit" disabled={loading}>
                      {loading ? 'Ajout en cours...' : 'Publier la photo'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default AddPhotoPage;
