const API_BASE_URL = import.meta.env.VITE_API_URL;

export const photoService = {
  async getAllPhotos() {
    const response = await fetch(API_BASE_URL + "/photos");
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
    return `${API_BASE_URL}/${id}/image`;
  },

  async uploadPhoto(title, description, imageUrl, category) {
    const formData = new FormData();
    formData.append('title', title);
    if (description) {
      formData.append('description', description);
    }
    formData.append('image', imageUrl);
    formData.append('category', category);

    const response = await fetch(API_BASE_URL + "/photos", {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload photo');
    }
    return response.json();
  },

  async deletePhoto(id) {
    const response = await fetch(`${API_BASE_URL}/photos/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete photo');
    }
  }
};

export default photoService;
