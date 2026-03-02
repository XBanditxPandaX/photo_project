import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import {useNavigate} from "react-router";

function App() {
    const navigate=  useNavigate();
    const [contrast, setContrast] = useState(() => Number(localStorage.getItem('contrastLevel')) || 100);
    const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

    useEffect(() => {
      const level = contrast / 100;
      document.documentElement.style.setProperty('--contrast-level', level);
      document.documentElement.style.setProperty('--brightness-level', level);
      localStorage.setItem('contrastLevel', String(contrast));
    }, [contrast]);

  return (
    <>
      <div className="app app-content">
        <header className="header">
          <h1>Galerie Photo</h1>
          <p>Portfolio du photographe</p>
          <a className="header-contact-link" onClick={() => navigate("/contact")}>
            Aller a la page contact
          </a>
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
            <div className="accessibility-labels">
              <span>Sombre</span>
              <span>Clair</span>
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
