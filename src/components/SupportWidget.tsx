"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 50 }}>
      {isOpen && (
        <div style={{ 
          marginBottom: '1rem', 
          width: '300px', 
          background: 'var(--surface)', 
          borderRadius: 'var(--radius-md)', 
          boxShadow: 'var(--shadow-lg)', 
          border: '1px solid var(--border)',
          overflow: 'hidden'
        }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>Support Chat</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>
          <div style={{ padding: '1rem', height: '200px', overflowY: 'auto', background: 'var(--surface-alt)' }}>
            <div style={{ marginBottom: '0.5rem', padding: '0.5rem', background: 'white', borderRadius: 'var(--radius-sm)', maxWidth: '80%' }}>
              Hello! How can we help you today?
            </div>
          </div>
          <div style={{ padding: '0.5rem', borderTop: '1px solid var(--border)' }}>
            <input type="text" placeholder="Type a message..." style={{ width: '100%', border: 'none', outline: 'none' }} />
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="btn btn-primary" 
        style={{ borderRadius: '50%', width: '3.5rem', height: '3.5rem', padding: 0 }}
      >
        <MessageCircle />
      </button>
    </div>
  );
}
