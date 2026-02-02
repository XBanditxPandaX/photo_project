const API_BASE_URL = '/api/photos';

export const photoService = {
  async getAllPhotos() {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch photos');
    }
    return response.json();
  },

  async getPhotoById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch photo');
    }
    return response.json();
  },

  getPhotoImageUrl(id) {
    return `${API_BASE_URL}/${id}/image`;
  },

  async uploadPhoto(title, description, imageFile) {
    const formData = new FormData();
    formData.append('title', title);
    if (description) {
      formData.append('description', description);
    }
    formData.append('image', imageFile);

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload photo');
    }
    return response.json();
  },

  async deletePhoto(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete photo');
    }
  }
};

export default photoService;
