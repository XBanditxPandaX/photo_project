import { useState } from 'react';
import contactService from '../services/contactService';

function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await contactService.sendContact(formData);
      setSuccessMessage('Message envoyé avec succès.');
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Contact</h1>
        <p>Envoyer un message</p>
      </header>

      <main className="main">
        <section className="contact-panel" aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" className="contact-title">Contactez-moi !</h2>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName">Prenom</label>
              <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Nom</label>
              <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Mail</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="6" value={formData.message} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn-submit contact-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </form>

          {successMessage && (
            <p className="contact-success" role="status">
              {successMessage}
            </p>
          )}

          {errorMessage && (
            <p className="contact-error" role="alert">
              {errorMessage}
            </p>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2026 - Tous droits réservés</p>
      </footer>
    </div>
  );
}

export default ContactPage;