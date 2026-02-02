import Gallery from './components/Gallery';

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Galerie Photo</h1>
        <p>Portfolio du photographe</p>
      </header>

      <main className="main">
        <Gallery />
      </main>

      <footer className="footer">
        <p>&copy; 2024 - Tous droits reservés</p>
      </footer>
    </div>
  );
}

export default App;
