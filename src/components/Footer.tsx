import Link from "next/link";
import fs from 'fs/promises';
import path from 'path';

async function getSettings() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'settings.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

export default async function Footer() {
  const settings = await getSettings();
  const companyName = settings.companyName || "Cleaning Service";
  const email = settings.email || "hello@example.com";
  const phone = settings.phone || "123-456-7890";

  return (
    <footer style={{ background: 'var(--secondary)', color: 'var(--text-inverted)', padding: 'var(--spacing-lg) 0' }}>
      <div className="container">
        <div className="grid-3">
          <div>
            <h3 style={{ marginBottom: '1rem' }}>{companyName}</h3>
            <p style={{ color: 'var(--text-muted)' }}>Making your world spotless, one room at a time.</p>
          </div>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Quick Links</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/">Home</Link>
              <Link href="/book">Book Now</Link>
            </div>
          </div>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Contact</h3>
            <p>{phone}</p>
            <p>{email}</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #334155', marginTop: '2rem', paddingTop: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
