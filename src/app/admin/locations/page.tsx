"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Edit, Save } from "lucide-react";

export default function LocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLocation, setNewLocation] = useState({ name: "", address: "", phone: "" });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const res = await fetch("/api/locations");
    const data = await res.json();
    setLocations(data);
    setLoading(false);
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLocation),
    });
    setIsModalOpen(false);
    setNewLocation({ name: "", address: "", phone: "" });
    fetchLocations();
  };

  const handleSave = async (location: any) => {
    await fetch("/api/locations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(location),
    });
    setEditingId(null);
    fetchLocations();
  };

  if (loading) return <div className="section container">Loading...</div>;

  return (
    <div className="section container">
      <div className="flex justify-between items-center mb-lg">
        <h1 className="flex items-center gap-sm">
          <MapPin /> Locations
        </h1>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={18} /> Add Location
        </button>
      </div>

      <div className="grid-3">
        {locations.map((location) => (
          <div key={location.id} className="card">
            {editingId === location.id ? (
              <div>
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    value={location.name} 
                    onChange={(e) => {
                      const updated = locations.map(l => 
                        l.id === location.id ? { ...l, name: e.target.value } : l
                      );
                      setLocations(updated);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea 
                    value={location.address} 
                    onChange={(e) => {
                      const updated = locations.map(l => 
                        l.id === location.id ? { ...l, address: e.target.value } : l
                      );
                      setLocations(updated);
                    }}
                    rows={2}
                  />
                </div>
                <div className="form-group mb-md">
                  <label>Phone</label>
                  <input 
                    value={location.phone} 
                    onChange={(e) => {
                      const updated = locations.map(l => 
                        l.id === location.id ? { ...l, phone: e.target.value } : l
                      );
                      setLocations(updated);
                    }}
                  />
                </div>
                <button onClick={() => handleSave(location)} className="btn btn-primary" style={{ width: '100%' }}>
                  <Save size={16} /> Save
                </button>
              </div>
            ) : (
              <div>
                <h3 style={{ marginBottom: '1rem' }}>{location.name}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  📍 {location.address}
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  📞 {location.phone}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => setEditingId(location.id)} 
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button 
                    onClick={() => handleSave({ ...location, active: !location.active })}
                    className="btn"
                    style={{ 
                      flex: 1,
                      background: location.active ? '#dcfce7' : '#fee2e2',
                      color: location.active ? '#166534' : '#991b1b'
                    }}
                  >
                    {location.active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Location Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '400px' }}>
            <h2 className="mb-md">Add New Location</h2>
            <form onSubmit={handleAddLocation}>
              <div className="form-group">
                <label>Location Name</label>
                <input 
                  required 
                  value={newLocation.name} 
                  onChange={e => setNewLocation({...newLocation, name: e.target.value})}
                  placeholder="Downtown Branch"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea 
                  required
                  value={newLocation.address} 
                  onChange={e => setNewLocation({...newLocation, address: e.target.value})}
                  placeholder="123 Main St, City"
                  rows={3}
                />
              </div>
              <div className="form-group mb-lg">
                <label>Phone</label>
                <input 
                  required
                  type="tel"
                  value={newLocation.phone} 
                  onChange={e => setNewLocation({...newLocation, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="flex justify-between">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Location</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
