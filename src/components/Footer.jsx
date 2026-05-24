export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="brand">
            <svg className="logo" viewBox="0 0 48 48" fill="none">
              <ellipse cx="24" cy="24" rx="13" ry="21" transform="rotate(45 24 24)" fill="#ffd60a" stroke="#0a1a33" strokeWidth="2.5"/>
              <path d="M14 24 L34 24" stroke="#0a1a33" strokeWidth="2.5"/>
            </svg>
            <span className="name">Club de Rugby Las Palmas</span>
          </div>
          <div className="socials">
            <a href="https://www.instagram.com/crlp.gc/" title="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="#eef1f5" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="#eef1f5" stroke="none"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/clubrugbylaspalmas/" title="Facebook">
              <svg viewBox="0 0 24 24" fill="#eef1f5">
                <path d="M14 9h3V5h-3c-2.2 0-4 1.8-4 4v2H7v4h3v6h4v-6h3l1-4h-4V9c0-.6.4-1 1-1z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/tamaranas.crlp/" title="Tamaranas">
              <svg viewBox="0 0 24 24" fill="none" stroke="#eef1f5" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
              </svg>
            </a>
          </div>
        </div>
        <p className="copy">CRLP · Las Palmas de Gran Canaria · Desde 1987</p>
      </div>
    </footer>
  )
}
