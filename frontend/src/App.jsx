import Gallery from './components/Gallery';
import Footer from './components/Footer';

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

      <Footer />
    </div>
  );
} 

export default App;
