const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const photoService = {
  async getAllPhotos() {
    const response = await fetch(API_BASE_URL + '/photos');
    if (!response.ok) {
      throw new Error('Failed to fetch photos');
    }
    return response.json();
  },

  async getPhotoById(id) {
    const response = await fetch(`${API_BASE_URL}/photos/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch photo');
    }
    return response.json();
  },

  getPhotoImageUrl(id) {
    return `${API_BASE_URL}/photos/${id}/image`;
  },

  async uploadPhoto(title, description, imageUrl, category) {
    const formData = new FormData();
    formData.append('title', title);
    if (description) {
      formData.append('description', description);
    }
    formData.append('image', imageUrl);
    formData.append('category', category);

    const response = await fetch(API_BASE_URL + '/photos', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });

    if (!response.ok) {
      const message = response.status === 403
        ? "Acces reserve a l'administrateur."
        : 'Failed to upload photo';
      throw new Error(message);
    }
    return response.json();
  },

  async deletePhoto(id) {
    const response = await fetch(`${API_BASE_URL}/photos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete photo');
    }
  },

  async updatePhoto(id, payload) {
    const response = await fetch(`${API_BASE_URL}/photos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const message = response.status === 403
        ? "Acces reserve a l'administrateur."
        : 'Failed to update photo';
      throw new Error(message);
    }

    return response.json();
  }
};

export default photoService;
