"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { getEmbedLink } from "@/utils/imageUtils";

export default function Navbar() {
  const [content, setContent] = useState<any>({});
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(setContent);
  }, []);

  const logoUrl = getEmbedLink(content.branding?.logoUrl);
  const siteName = content.branding?.siteName || "PristineClean";

  return (
    <nav style={{ 
      background: 'var(--surface)', 
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="container" style={{ 
        height: '70px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        
        {/* Logo Section */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {content.branding?.logoType === 'link' && logoUrl ? (
            <img 
              src={logoUrl} 
              alt={siteName} 
              style={{ height: '40px', objectFit: 'contain' }}
            />
          ) : (
            <div style={{ 
              height: '40px', 
              width: '40px', 
              background: 'var(--primary)', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}>
              {siteName.charAt(0)}
            </div>
          )}
          <div className="flex flex-col">
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              {siteName}
            </span>
            {content.branding?.tagline && (
              <span className="text-muted" style={{ fontSize: '0.75rem', marginTop: '-2px' }}>
                {content.branding.tagline}
              </span>
            )}
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/book" className="btn btn-primary">Book Now</Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="show-mobile btn" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ 
          background: 'var(--surface)', 
          borderTop: '1px solid var(--border)',
          padding: '1rem',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem'
        }}>
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/services" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link href="/book" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Book Now</Link>
        </div>
      )}

      <style jsx>{`
        .hide-mobile { display: flex; }
        .show-mobile { display: none; }
        
        @media (max-width: 768px) {
          .hide-mobile { display: none; }
          .show-mobile { display: flex; }
        }
      `}</style>
    </nav>
  );
}
