"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Edit, Trash } from "lucide-react";

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

      {/* Hero Section */}
      <div className="card mb-lg">
        <h2 className="mb-md">Hero Section</h2>
        <div className="form-group">
          <label>Title</label>
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
      {isModalOpen && editingTestimonial && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '400px' }}>
            <h2 className="mb-md">Edit Testimonial</h2>
            <div className="form-group">
              <label>Name</label>
              <input 
                value={editingTestimonial.name} 
                onChange={e => setEditingTestimonial({...editingTestimonial, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Rating</label>
              <select 
                value={editingTestimonial.rating} 
                onChange={e => setEditingTestimonial({...editingTestimonial, rating: Number(e.target.value)})}
              >
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
              </select>
            </div>
            <div className="form-group mb-lg">
              <label>Review Text</label>
              <textarea 
                value={editingTestimonial.text} 
                onChange={e => setEditingTestimonial({...editingTestimonial, text: e.target.value})}
                rows={4}
              />
            </div>
            <div className="flex justify-between">
              <button onClick={() => {
                setIsModalOpen(false);
                setEditingTestimonial(null);
              }} className="btn btn-secondary">Cancel</button>
              <button onClick={saveTestimonial} className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
