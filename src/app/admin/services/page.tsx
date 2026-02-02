"use client";

import { useEffect, useState } from "react";
import { Edit, Save } from "lucide-react";

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

  if (loading) return <div className="section container">Loading...</div>;

  return (
    <div className="section container">
      <h1 className="mb-lg">Manage Services</h1>
      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
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
                                <input value={s.title} onChange={(e) => {
                                    const newServices = services.map(srv => srv.id === s.id ? { ...srv, title: e.target.value } : srv);
                                    setServices(newServices);
                                }} />
                            ) : s.title}
                        </td>
                         <td style={{ padding: '1rem' }}>
                            {editingId === s.id ? (
                                <input type="number" value={s.price} onChange={(e) => {
                                    const newServices = services.map(srv => srv.id === s.id ? { ...srv, price: Number(e.target.value) } : srv);
                                    setServices(newServices);
                                }} style={{ width: '100px' }} />
                            ) : `$${s.price}`}
                        </td>
                         <td style={{ padding: '1rem' }}>
                            <input type="checkbox" checked={s.active !== false} onChange={async (e) => {
                                 const updated = { ...s, active: e.target.checked };
                                 await handleSave(updated);
                            }} />
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
