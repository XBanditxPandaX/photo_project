import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import { useNavigate } from "react-router";
import { isAuthenticated, logout, syncCurrentUser } from './services/authService.js';

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

function App() {
    const navigate = useNavigate();
    const [contrast, setContrast] = useState(getInitialContrast);
    const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);
    const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(isAuthenticated);

    function handleLogout() {
        logout();
        setLoggedIn(false);
    }

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

    useEffect(() => {
      if (!isAuthenticated()) {
        return;
      }

      syncCurrentUser().catch(() => {
        setLoggedIn(false);
      });
    }, []);

  return (
    <>
      <div className="app app-content">
        <header className="header">
          <h1>Galerie Photo</h1>
          <p>Portfolio du photographe</p>
          <div className="header-actions">
            <a className="header-contact-link" onClick={() => navigate("/contact")}>
              Aller a la page contact
            </a>
            {loggedIn ? (
              <button className="header-auth-btn header-auth-btn--logout" onClick={handleLogout}>
                Déconnexion
              </button>
            ) : (
              <button className="header-auth-btn" onClick={() => navigate("/auth")}>
                Se connecter
              </button>
            )}
          </div>
        </header>

        <Hero />

        <main className="main" id="gallery-section">
          <Gallery />
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

export default App;
