export default function Footer() {
  return (
    <footer style={{ background: 'var(--secondary)', color: 'var(--text-inverted)', padding: 'var(--spacing-lg) 0' }}>
      <div className="container">
        <div className="grid-3">
          <div>
            <h3 style={{ marginBottom: '1rem' }}>PristineClean</h3>
            <p style={{ color: 'var(--text-muted)' }}>Making your world spotless, one room at a time.</p>
          </div>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Quick Links</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="/">Home</a>
              <a href="/book">Book Now</a>
            </div>
          </div>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Contact</h3>
            <p>123 Clean Street</p>
            <p>Sparkle City, SC 12345</p>
            <p>hello@pristineclean.com</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #334155', marginTop: '2rem', paddingTop: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} PristineClean Services. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
