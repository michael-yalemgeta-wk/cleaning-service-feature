import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <nav style={{ 
      borderBottom: '1px solid var(--border)', 
      background: 'var(--surface)', 
      position: 'sticky', 
      top: 0, 
      zIndex: 50 
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
          <Sparkles />
          <span>PristineClean</span>
        </Link>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link href="/">Home</Link>
          <Link href="/book">Book Now</Link>
          <Link href="/customer/bookings">My Bookings</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/login" style={{ color: 'var(--text-muted)' }}>Admin</Link>
          <Link href="/worker/login" style={{ color: 'var(--text-muted)' }}>Worker</Link>
        </div>
        <Link href="/book" className="btn btn-primary">
          Get a Quote
        </Link>
      </div>
    </nav>
  );
}
