"use client";

import { useEffect, useState } from "react";
import { Edit, Save, Image as ImageIcon } from "lucide-react";
import { getEmbedLink } from "@/utils/imageUtils";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await fetch("/api/services");
    const data = await res.json();
    setServices(data);
    setLoading(false);
  };

  const handleSave = async (service: any) => {
    await fetch("/api/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service),
    });
    setEditingId(null);
    fetchServices();
  };

  const updateService = (id: string, field: string, value: any) => {
    const newServices = services.map(srv => 
      srv.id === id ? { ...srv, [field]: value } : srv
    );
    setServices(newServices);
  };

  if (loading) return <div className="section container">Loading...</div>;

  return (
    <div className="section container">
      <h1 className="mb-lg">Manage Services</h1>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1rem' }}>Image</th>
                    <th style={{ padding: '1rem' }}>Service</th>
                    <th style={{ padding: '1rem' }}>Price ($)</th>
                    <th style={{ padding: '1rem' }}>Active</th>
                    <th style={{ padding: '1rem' }}>Action</th>
                </tr>
            </thead>
            <tbody>
                {services.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem' }}>
                            {editingId === s.id ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                  <input 
                                    value={s.imageUrl || ""} 
                                    onChange={(e) => updateService(s.id, 'imageUrl', e.target.value)}
                                    placeholder="Image URL"
                                    style={{ fontSize: '0.85rem' }}
                                  />
                                  {s.imageUrl && (
                                    <img 
                                      src={getEmbedLink(s.imageUrl)} 
                                      alt="Preview" 
                                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                    />
                                  )}
                                </div>
                            ) : (
                                s.imageUrl ? (
                                  <img 
                                    src={getEmbedLink(s.imageUrl)} 
                                    alt={s.title} 
                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                                  />
                                ) : (
                                  <div style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    background: 'var(--surface-alt)', 
                                    borderRadius: 'var(--radius-sm)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    <ImageIcon size={24} color="var(--text-muted)" />
                                  </div>
                                )
                            )}
                        </td>
                        <td style={{ padding: '1rem' }}>
                            {editingId === s.id ? (
                                <input 
                                  value={s.title} 
                                  onChange={(e) => updateService(s.id, 'title', e.target.value)} 
                                />
                            ) : s.title}
                        </td>
                         <td style={{ padding: '1rem' }}>
                            {editingId === s.id ? (
                                <input 
                                  type="number" 
                                  value={s.price} 
                                  onChange={(e) => updateService(s.id, 'price', Number(e.target.value))}
                                  style={{ width: '100px' }} 
                                />
                            ) : `$${s.price}`}
                        </td>
                         <td style={{ padding: '1rem' }}>
                            <input 
                              type="checkbox" 
                              checked={s.active !== false} 
                              onChange={async (e) => {
                                 const updated = { ...s, active: e.target.checked };
                                 await handleSave(updated);
                              }} 
                            />
                        </td>
                         <td style={{ padding: '1rem' }}>
                            {editingId === s.id ? (
                                <button onClick={() => handleSave(s)} className="btn btn-primary" style={{ padding: '0.5rem' }}>
                                    <Save size={16} />
                                </button>
                            ) : (
                                <button onClick={() => setEditingId(s.id)} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                                    <Edit size={16} />
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
