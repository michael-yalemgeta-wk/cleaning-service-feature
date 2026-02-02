"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const [content, setContent] = useState<any>({});
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(setContent);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    }, 1000);
  };

  return (
    <div className="section container">
      <div className="text-center mb-lg">
        <h1 className="mb-md">Contact Us</h1>
        <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Have questions or ready to book? We're here to help. Reach out to us directly or fill out the form below.
        </p>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: '1.5fr 1fr', alignItems: 'start' }}>
        
        {/* Contact Form */}
        <div className="card">
          {submitted ? (
            <div className="text-center py-lg">
              <h2 className="text-success mb-sm">Message Sent!</h2>
              <p>Thank you for reaching out. We'll get back to you shortly.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="btn btn-primary mt-md"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="mb-md">Send a Message</h2>
              <div className="form-group">
                <label>Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Your Name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="your@email.com"
                />
              </div>
              <div className="form-group mb-lg">
                <label>Message</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  placeholder="How can we help you?"
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card">
            <h3 className="mb-md">Contact Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="flex items-center gap-sm">
                <div style={{ padding: '0.5rem', background: 'var(--surface-alt)', borderRadius: '50%' }}>
                  <Phone size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted">Phone</div>
                  <div className="font-medium">{content.contact?.phone || "Loading..."}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-sm">
                <div style={{ padding: '0.5rem', background: 'var(--surface-alt)', borderRadius: '50%' }}>
                  <Mail size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted">Email</div>
                  <div className="font-medium">{content.contact?.email || "Loading..."}</div>
                </div>
              </div>

              <div className="flex items-center gap-sm">
                <div style={{ padding: '0.5rem', background: 'var(--surface-alt)', borderRadius: '50%' }}>
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted">Address</div>
                  <div className="font-medium">{content.contact?.address || "Loading..."}</div>
                </div>
              </div>

              <div className="flex items-center gap-sm">
                <div style={{ padding: '0.5rem', background: 'var(--surface-alt)', borderRadius: '50%' }}>
                  <Clock size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted">Business Hours</div>
                  <div className="font-medium">{content.contact?.hours || "Loading..."}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', height: '250px' }}>
             <iframe 
               width="100%" 
               height="100%" 
               frameBorder="0" 
               scrolling="no" 
               marginHeight={0} 
               marginWidth={0} 
               src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=1%20Grafton%20Street,%20Dublin,%20Ireland+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
               style={{ border: 0 }}
             ></iframe>
          </div>

        </div>
      </div>
    </div>
  );
}
