"use client";

import { useEffect, useState } from "react";
import { User, Key, Save } from "lucide-react";

export default function WorkerProfile() {
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [staffId, setStaffId] = useState("");

  useEffect(() => {
    const sid = localStorage.getItem("workerStaffId");
    if (sid) {
        setStaffId(sid);
        fetchProfile(sid);
    } else {
        setLoading(false);
    }
  }, []);

  const fetchProfile = async (sid: string) => {
    try {
        const res = await fetch('/api/staff');
        const allStaff = await res.json();
        const me = allStaff.find((s: any) => s.id === sid);
        setWorker(me);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newPassword) return;

      // We'll update the password via the workers API
      await fetch("/api/workers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ staffId, newPassword }),
      });
      
      alert("Password updated successfully!");
      setNewPassword("");
  };

  if (loading) return <div className="section container">Loading...</div>;
  if (!worker) return <div className="section container">Profile not found.</div>;

  return (
    <div className="section container">
      <h1 className="mb-lg flex items-center gap-sm">
        <User /> My Profile
      </h1>

      <div className="grid-2">
          {/* Profile Details */}
          <div className="card">
              <h2 className="mb-md">Details</h2>
              <div className="form-group">
                  <label>Name</label>
                  <input value={worker.name} disabled style={{ background: '#f1f5f9' }} />
              </div>
              <div className="form-group">
                  <label>Email</label>
                  <input value={worker.email} disabled style={{ background: '#f1f5f9' }} />
              </div>
              <div className="form-group">
                  <label>Role</label>
                  <input value={worker.role} disabled style={{ background: '#f1f5f9' }} />
              </div>
              <div className="form-group">
                  <label>Status</label>
                  <span style={{ 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '0.5rem', 
                    fontSize: '0.75rem',
                    background: worker.status === 'Active' ? '#dcfce7' : '#f1f5f9',
                    color: worker.status === 'Active' ? '#166534' : '#64748b',
                    display: 'inline-block'
                  }}>
                    {worker.status}
                  </span>
              </div>
          </div>

          {/* Performance Stats */}
          <div className="card">
              <h2 className="mb-md">Performance</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ padding: '1.5rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{worker.jobsCompleted || 0}</div>
                      <div style={{ color: 'var(--text-muted)' }}>Jobs Completed</div>
                  </div>
                  <div style={{ padding: '1.5rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#eab308' }}>
                          {worker.performanceRating ? Number(worker.performanceRating).toFixed(1) : "N/A"}
                      </div>
                      <div style={{ color: 'var(--text-muted)' }}>Rating</div>
                  </div>
              </div>
          </div>
      </div>

      {/* Password Change */}
      <div className="card mt-lg" style={{ maxWidth: '400px' }}>
          <h2 className="mb-md flex items-center gap-sm"><Key size={20} /> Change Password</h2>
          <form onSubmit={handlePasswordReset}>
              <div className="form-group">
                  <label>New Password</label>
                  <input 
                      type="password" 
                      value={newPassword} 
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                  />
              </div>
              <button type="submit" className="btn btn-primary flex items-center gap-sm">
                  <Save size={18} /> Update Password
              </button>
          </form>
      </div>
    </div>
  );
}
