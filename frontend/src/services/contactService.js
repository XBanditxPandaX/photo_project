const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/+$/, '');

export const contactService = {
  async sendContact(payload) {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const contentType = response.headers.get('content-type') || '';
    const body = contentType.includes('application/json') ? await response.json() : null;

    if (!response.ok) {
      throw new Error(body?.error || 'Impossible d\'envoyer le message pour le moment.');
    }

    return body;
  }
};

export default contactService;
