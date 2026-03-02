import Hero from './components/Hero';
import Gallery from './components/Gallery';
import ContactPage from './components/ContactPage';

function App() {
  const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/';

  if (normalizedPath === '/contact') {
    return <ContactPage />;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Galerie Photo</h1>
        <p>Portfolio du photographe</p>
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
