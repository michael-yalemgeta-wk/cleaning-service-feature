"use client";

import { useEffect, useState } from "react";

export default function GlobalSettings() {
  const [settings, setSettings] = useState<any>({ companyName: "", taxRate: 0, bookingEnabled: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
     e.preventDefault();
     await fetch("/api/settings", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(settings)
     });
     alert("Settings Saved!");
  };

  if (loading) return <div className="section container">Loading...</div>;

  return (
    <div className="section container">
      <h1 className="mb-lg">Global Settings</h1>
      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Company Name</label>
            <input value={settings.companyName} onChange={e => setSettings({...settings, companyName: e.target.value})} />
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
          <button type="submit" className="btn btn-primary">Save Configuration</button>
        </form>
      </div>
    </div>
  );
}
