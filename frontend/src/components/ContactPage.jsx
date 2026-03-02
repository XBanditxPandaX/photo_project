import { useEffect, useState } from 'react';
import contactService from '../services/contactService';
import { useNavigate } from 'react-router';

const CONTRAST_STORAGE_KEY = 'contrastLevel';
const DARK_MODE_STORAGE_KEY = 'darkModeEnabled';

const getInitialContrast = () => {
  const stored = Number(localStorage.getItem(CONTRAST_STORAGE_KEY));
  return Number.isFinite(stored) && stored >= 70 && stored <= 130 ? stored : 100;
};

const getInitialDarkMode = () => {
  const stored = localStorage.getItem(DARK_MODE_STORAGE_KEY);
  if (stored === 'true') {
    return true;
  }
  if (stored === 'false') {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

function ContactPage() {
  const [contrast, setContrast] = useState(getInitialContrast);
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
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
      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const level = contrast / 100;
    document.documentElement.style.setProperty('--contrast-level', level);
    document.documentElement.style.setProperty('--brightness-level', level);
    localStorage.setItem(CONTRAST_STORAGE_KEY, String(contrast));
  }, [contrast]);

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem(DARK_MODE_STORAGE_KEY, String(isDarkMode));
  }, [isDarkMode]);

  return (
    <>
      <div className="app app-content">
        <header className="header">
          <h1>Contact</h1>
          <p>Envoyer un message</p>
          <button type="button" className="header-contact-link" onClick={() => navigate('/')}>
            Retour au menu
          </button>
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
                <label htmlFor="subject">Objet</label>
                <input id="subject" name="subject" type="text" value={formData.subject} onChange={handleChange} required />
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
      <div className="accessibility-fab">
        <button
          type="button"
          className="accessibility-trigger"
          aria-haspopup="dialog"
          aria-expanded={isAccessibilityOpen}
          onClick={() => setIsAccessibilityOpen((prev) => !prev)}
        >
          Accessibilité
        </button>
        {isAccessibilityOpen && (
          <div className="accessibility-panel" role="dialog" aria-label="Parametres d'accessibilite">
            <div className="accessibility-toggle">
              <span>Mode sombre</span>
              <button
                type="button"
                role="switch"
                aria-checked={isDarkMode}
                aria-label="Activer ou desactiver le mode sombre"
                className={`accessibility-switch${isDarkMode ? ' is-on' : ''}`}
                onClick={() => setIsDarkMode((prev) => !prev)}
              >
                <span className="accessibility-switch-thumb" />
              </button>
            </div>
            <label className="accessibility-slider">
              <span>Contraste</span>
              <input
                type="range"
                min="70"
                max="130"
                value={contrast}
                onChange={(event) => setContrast(Number(event.target.value))}
                aria-label="Contraste"
              />
              <span className="accessibility-value">{contrast}%</span>
            </label>
          </div>
        )}
      </div>
    </>
  );
}

export default ContactPage;
