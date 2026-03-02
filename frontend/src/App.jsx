import Hero from './components/Hero';
import Gallery from './components/Gallery';
import ContactPage from './components/ContactPage';
import {useNavigate} from "react-router";

function App() {
    const navigate=  useNavigate();

  return (
    <div className="app">
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
  );
}

export default App;
