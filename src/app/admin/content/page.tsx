"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Edit, Trash } from "lucide-react";
import Modal from "@/components/Modal";

export default function ContentManagement() {
  const [content, setContent] = useState<any>({ hero: {}, testimonials: [] });
  const [loading, setLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content)
    });
    alert("Content saved!");
  };

  const addTestimonial = () => {
    setEditingTestimonial({ id: `test-${Date.now()}`, name: "", rating: 5, text: "" });
    setIsModalOpen(true);
  };

  const saveTestimonial = () => {
    const updated = { ...content };
    const index = updated.testimonials.findIndex((t: any) => t.id === editingTestimonial.id);
    if (index >= 0) {
      updated.testimonials[index] = editingTestimonial;
    } else {
      updated.testimonials.push(editingTestimonial);
    }
    setContent(updated);
    setIsModalOpen(false);
    setEditingTestimonial(null);
  };

  const deleteTestimonial = (id: string) => {
    const updated = { ...content };
    updated.testimonials = updated.testimonials.filter((t: any) => t.id !== id);
    setContent(updated);
  };

  if (loading) return <div className="section container">Loading...</div>;

  return (
    <div className="section container">
      <div className="flex justify-between items-center mb-lg">
        <h1>Content Management</h1>
        <button onClick={handleSave} className="btn btn-primary">
          <Save size={18} /> Save All Changes
        </button>
      </div>

      {/* Branding Section */}
      <div className="card mb-lg">
        <h2 className="mb-md">Branding & Logo</h2>
        <div className="grid-3 mb-md">
          <div className="form-group">
            <label>Website Name</label>
            <input 
              value={content.branding?.siteName || ""} 
              onChange={e => setContent({...content, branding: {...content.branding, siteName: e.target.value}})}
            />
          </div>
          <div className="form-group">
            <label>Tagline</label>
            <input 
              value={content.branding?.tagline || ""} 
              onChange={e => setContent({...content, branding: {...content.branding, tagline: e.target.value}})}
            />
          </div>
          <div className="form-group">
            <label>Logo Type</label>
            <select
              value={content.branding?.logoType || "alphabet"}
              onChange={e => setContent({...content, branding: {...content.branding, logoType: e.target.value}})}
            >
              <option value="alphabet">Alphabet (First Letter)</option>
              <option value="link">Image Link</option>
            </select>
          </div>
        </div>
        
        {content.branding?.logoType === "link" && (
          <div className="form-group mb-md">
            <label>Logo Image URL (Google Drive Link supported)</label>
            <input 
              value={content.branding?.logoUrl || ""} 
              onChange={e => setContent({...content, branding: {...content.branding, logoUrl: e.target.value}})}
              placeholder="https://drive.google.com/..."
            />
          </div>
        )}

        {/* Logo Preview */}
        <div className="form-group">
          <label>Logo Preview</label>
          <div style={{ padding: '1.5rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {content.branding?.logoType === "link" && content.branding?.logoUrl ? (
              <img 
                src={content.branding.logoUrl} 
                alt="Logo Preview" 
                style={{ height: '40px', objectFit: 'contain' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
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
                {(content.branding?.siteName || "P").charAt(0).toUpperCase()}
              </div>
            )}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              This is how your logo will appear in the navbar
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="card mb-lg">
        <h2 className="mb-md">Hero Section</h2>
        <div className="form-group">
          <label>Hero Title</label>
          <input 
            value={content.hero.title || ""} 
            onChange={e => setContent({...content, hero: {...content.hero, title: e.target.value}})}
          />
        </div>
        <div className="form-group">
          <label>Subtitle</label>
          <textarea 
            value={content.hero.subtitle || ""} 
            onChange={e => setContent({...content, hero: {...content.hero, subtitle: e.target.value}})}
            rows={3}
          />
        </div>
        <div className="form-group mt-md">
          <label>Hero Background Image URL</label>
          <input 
            value={content.hero.backgroundImage || ""} 
            onChange={e => setContent({...content, hero: {...content.hero, backgroundImage: e.target.value}})}
            placeholder="https://images.unsplash.com/..."
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="card mb-lg">
        <h2 className="mb-md">Contact Information</h2>
        <div className="grid-3">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              value={content.contact?.email || ""} 
              onChange={e => setContent({...content, contact: {...content.contact, email: e.target.value}})}
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input 
              value={content.contact?.phone || ""} 
              onChange={e => setContent({...content, contact: {...content.contact, phone: e.target.value}})}
            />
          </div>
          <div className="form-group">
            <label>Business Hours</label>
            <input 
              value={content.contact?.hours || ""} 
              onChange={e => setContent({...content, contact: {...content.contact, hours: e.target.value}})}
            />
          </div>
        </div>
        <div className="form-group mt-md">
          <label>Physical Address</label>
          <input 
            value={content.contact?.address || ""} 
            onChange={e => setContent({...content, contact: {...content.contact, address: e.target.value}})}
          />
        </div>
      </div>

      {/* Testimonials */}
      <div className="card">
        <div className="flex justify-between items-center mb-md">
          <h2>Testimonials</h2>
          <button onClick={addTestimonial} className="btn btn-secondary">
            <Plus size={18} /> Add Testimonial
          </button>
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {content.testimonials?.map((test: any) => (
            <div key={test.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flexGrow: 1 }}>
                <h4>{test.name} - {test.rating} ⭐</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>"{test.text}"</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => {
                    setEditingTestimonial(test);
                    setIsModalOpen(true);
                  }}
                  className="btn btn-secondary" 
                  style={{ padding: '0.5rem' }}
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => deleteTestimonial(test.id)}
                  className="btn btn-secondary" 
                  style={{ padding: '0.5rem' }}
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTestimonial(null);
        }}
        title="Edit Testimonial"
        size="sm"
      >
        <div className="form-group">
          <label>Name</label>
          <input 
            value={editingTestimonial?.name || ""} 
            onChange={e => setEditingTestimonial({...editingTestimonial, name: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Rating</label>
          <select 
            value={editingTestimonial?.rating || 5} 
            onChange={e => setEditingTestimonial({...editingTestimonial, rating: Number(e.target.value)})}
          >
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
          </select>
        </div>
        <div className="form-group mb-lg">
          <label>Review Text</label>
          <textarea 
            value={editingTestimonial?.text || ""} 
            onChange={e => setEditingTestimonial({...editingTestimonial, text: e.target.value})}
            rows={4}
          />
        </div>
        <div className="flex justify-end gap-sm">
          <button onClick={() => {
            setIsModalOpen(false);
            setEditingTestimonial(null);
          }} className="btn btn-secondary">Cancel</button>
          <button onClick={saveTestimonial} className="btn btn-primary">Save</button>
        </div>
      </Modal>
    </div>
  );
}
