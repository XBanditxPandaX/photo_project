function Hero() {
  const scrollToGallery = () => {
    const gallerySection = document.getElementById('gallery-section');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <div className="hero-card">
        <div className="hero-image-container">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face"
            alt="Jean Dupont"
          />
          <div className="hero-overlay">
            <h2 className="hero-name">Jean Dupont</h2>
            <p className="hero-title">Photographe</p>
            <p className="hero-quote">"Capturer l'instant, figer l'emotion."</p>
            <button className="btn-scroll-gallery" onClick={scrollToGallery}>
              Decouvrir
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
