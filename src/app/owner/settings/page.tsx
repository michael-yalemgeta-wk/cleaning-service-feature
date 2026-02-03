"use client";

import { useEffect, useState } from "react";
import { Save, Ban, Building } from "lucide-react";

export default function GlobalSettings() {
  const [settings, setSettings] = useState<any>({ 
    companyName: "", 
    taxRate: 0, 
    bookingEnabled: true,
    email: "",
    phone: "",
    blockedDates: []
  });
  const [newDayOff, setNewDayOff] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        setSettings({
            blockedDates: [],
            ...data
        });
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
     e.preventDefault();
     
     // Save settings.json
     await fetch("/api/settings", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(settings)
     });

     // Fetch current content to sync updates
     const contentRes = await fetch("/api/content");
     const contentData = await contentRes.json();
     
     const updatedContent = {
       ...contentData,
       branding: {
         ...contentData.branding,
         siteName: settings.companyName
       },
       contact: {
         ...contentData.contact,
         email: settings.email,
         phone: settings.phone
       }
     };

     await fetch("/api/content", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(updatedContent)
     });

     alert("Settings and Content Saved!");
  };

  const addDayOff = () => {
    if (!newDayOff) return;
    if (settings.blockedDates?.includes(newDayOff)) {
      alert("Date already added as Day Off");
      return;
    }
    setSettings({
      ...settings,
      blockedDates: [...(settings.blockedDates || []), newDayOff]
    });
    setNewDayOff("");
  };

  const removeDayOff = (date: string) => {
    setSettings({
      ...settings,
      blockedDates: settings.blockedDates.filter((d: string) => d !== date)
    });
  };

  if (loading) return <div className="section container">Loading...</div>;

  return (
    <div className="section container">
      <h1 className="mb-lg">Global Settings</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Company Details */}
        <div className="card">
            <h2 className="mb-md flex items-center gap-sm"><Building size={20} /> Company Details</h2>
            <form onSubmit={handleSave}>
                <div className="form-group">
                    <label>Company Name</label>
                    <input value={settings.companyName || ''} onChange={e => setSettings({...settings, companyName: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" value={settings.email || ''} onChange={e => setSettings({...settings, email: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" value={settings.phone || ''} onChange={e => setSettings({...settings, phone: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Tax Rate (%)</label>
                    <input type="number" step="0.01" value={settings.taxRate * 100} onChange={e => setSettings({...settings, taxRate: Number(e.target.value) / 100})} />
                </div>
                <div className="form-group mb-lg">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input type="checkbox" style={{ width: 'auto' }} checked={settings.bookingEnabled} onChange={e => setSettings({...settings, bookingEnabled: e.target.checked})} />
                        Enable Public Booking System
                    </label>
                </div>
                <button type="submit" className="btn btn-primary flex items-center gap-sm">
                    <Save size={18} /> Save Configuration
                </button>
            </form>
        </div>

        {/* Day Off Management */}
        <div className="card">
          <h2 className="mb-md flex items-center gap-sm"><Ban size={20} /> Manage Days Off</h2>
          <p className="text-muted mb-md">Select dates where the business is closed (Day Off).</p>
          
          <div className="flex gap-sm mb-md">
            <input 
              type="date" 
              value={newDayOff} 
              onChange={(e) => setNewDayOff(e.target.value)}
            />
            <button type="button" onClick={addDayOff} className="btn btn-secondary">Add Day Off</button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
            {(!settings.blockedDates || settings.blockedDates.length === 0) && <p className="text-muted">No days off set.</p>}
            {settings.blockedDates?.sort().map((date: string) => (
              <div key={date} style={{ 
                background: '#fee2e2', 
                color: '#991b1b', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>{date}</span>
                <button 
                  type="button"
                  onClick={() => removeDayOff(date)}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
