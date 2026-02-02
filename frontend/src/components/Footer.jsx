function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Contact</h3>
          <div className="footer-content">
            <div className="footer-item">
              <span className="footer-icon">📧</span>
              <a href="mailto:contact@photographe.fr" className="footer-link">
                contact@photographe.fr
              </a>
            </div>
            <div className="footer-item">
              <span className="footer-icon">📞</span>
              <a href="tel:+33123456789" className="footer-link">
                +33 1 23 45 67 89
              </a>
            </div>
            <div className="footer-item">
              <span className="footer-icon">📍</span>
              <address className="footer-address">
                123 Avenue de la Photographie<br />
                75001 Paris, France
              </address>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Réseaux sociaux</h3>
          <div className="footer-social">
            <a 
              href="https://instagram.com/photographe" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a 
              href="https://facebook.com/photographe" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Facebook"
            >
              Facebook
            </a>
            <a 
              href="https://twitter.com/photographe" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Twitter"
            >
              Twitter
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Horaires d'ouverture</h3>
          <div className="footer-hours">
            <div className="footer-hours-item">
              <span className="footer-hours-day">Lundi - Vendredi</span>
              <span className="footer-hours-time">9h00 - 18h00</span>
            </div>
            <div className="footer-hours-item">
              <span className="footer-hours-day">Samedi</span>
              <span className="footer-hours-time">10h00 - 16h00</span>
            </div>
            <div className="footer-hours-item">
              <span className="footer-hours-day">Dimanche</span>
              <span className="footer-hours-time">Fermé</span>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 - Tous droits réservés</p>
      </div>
    </footer>
  );
}

export default Footer;