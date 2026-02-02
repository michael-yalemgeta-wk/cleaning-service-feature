"use client";

import { useEffect, useState } from "react";
import { Save, Calendar, CreditCard, Ban } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    blockedDates: [],
    paymentMethods: {
      credit_card: false, // Default disabled
      paypal: false,      // Default disabled
      cash: true          // Default enabled
    },
    companyName: "",
    email: "",
    phone: "",
    taxRate: 0.08
  });
  const [newBlockedDate, setNewBlockedDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        // Ensure defaults if missing
        const defaults = {
          blockedDates: [],
          paymentMethods: { credit_card: false, paypal: false, cash: true },
          taxRate: 0.08,
          ...data
        };
        setSettings(defaults);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      const data = await res.json();
      setSettings(data);
      alert("Settings saved successfully!");
    } else {
      alert("Failed to save settings.");
    }
  };

  const addBlockedDate = () => {
    if (!newBlockedDate) return;
    if (settings.blockedDates.includes(newBlockedDate)) {
      alert("Date already blocked");
      return;
    }
    setSettings({
      ...settings,
      blockedDates: [...(settings.blockedDates || []), newBlockedDate]
    });
    setNewBlockedDate("");
  };

  const removeBlockedDate = (date: string) => {
    setSettings({
      ...settings,
      blockedDates: settings.blockedDates.filter((d: string) => d !== date)
    });
  };

  const togglePaymentMethod = (method: string) => {
    setSettings({
      ...settings,
      paymentMethods: {
        ...settings.paymentMethods,
        [method]: !settings.paymentMethods[method]
      }
    });
  };

  if (loading) return <div className="section container">Loading...</div>;

  return (
    <div className="section container">
      <h1 className="mb-lg flex items-center gap-sm">
        Configuration
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Payment Methods */}
        <div className="card">
          <h2 className="mb-md flex items-center gap-sm"><CreditCard /> Payment Methods</h2>
          <p className="text-muted mb-md">Toggle available payment options for customers.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="flex justify-between items-center" style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
              <span>Credit Card</span>
              <button 
                onClick={() => togglePaymentMethod('credit_card')}
                className={`btn ${settings.paymentMethods.credit_card ? 'btn-primary' : 'btn-secondary'}`}
              >
                {settings.paymentMethods.credit_card ? 'Components Enabled' : 'Disabled'}
              </button>
            </div>
            <div className="flex justify-between items-center" style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
              <span>PayPal</span>
              <button 
                onClick={() => togglePaymentMethod('paypal')}
                className={`btn ${settings.paymentMethods.paypal ? 'btn-primary' : 'btn-secondary'}`}
              >
                {settings.paymentMethods.paypal ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            <div className="flex justify-between items-center" style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
              <span>Cash on Arrival</span>
              <button 
                onClick={() => togglePaymentMethod('cash')}
                className={`btn ${settings.paymentMethods.cash ? 'btn-primary' : 'btn-secondary'}`}
              >
                {settings.paymentMethods.cash ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        {/* Blocked Dates */}
        <div className="card">
          <h2 className="mb-md flex items-center gap-sm"><Ban /> Blocked Dates</h2>
          <p className="text-muted mb-md">Select dates to prevent bookings.</p>
          
          <div className="flex gap-sm mb-md">
            <input 
              type="date" 
              value={newBlockedDate} 
              onChange={(e) => setNewBlockedDate(e.target.value)}
            />
            <button onClick={addBlockedDate} className="btn btn-secondary">Block</button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
            {settings.blockedDates?.length === 0 && <p className="text-muted">No blocked dates.</p>}
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
                  onClick={() => removeBlockedDate(date)}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Global Settings */}
        <div className="card">
            <h2 className="mb-md">Company Details</h2>
            <div className="form-group">
                <label>Company Name</label>
                <input 
                    value={settings.companyName || ''} 
                    onChange={e => setSettings({...settings, companyName: e.target.value})} 
                />
            </div>
            <div className="form-group">
                <label>Tax Rate (0.10 = 10%)</label>
                <input 
                    type="number" step="0.01"
                    value={settings.taxRate} 
                    onChange={e => setSettings({...settings, taxRate: parseFloat(e.target.value)})} 
                />
            </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleSave} className="btn btn-primary flex items-center gap-sm" style={{ padding: '1rem 3rem' }}>
            <Save size={20} /> Save All Changes
        </button>
      </div>
    </div>
  );
}
