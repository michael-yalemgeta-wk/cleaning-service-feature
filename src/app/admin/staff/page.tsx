"use client";

import { useEffect, useState } from "react";
import { Plus, Key } from "lucide-react";

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [newMember, setNewMember] = useState({ name: "", role: "Cleaner", email: "" });
  const [newWorker, setNewWorker] = useState({ username: "", password: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const staffRes = await fetch("/api/staff");
    const workersRes = await fetch("/api/workers");
    setStaff(await staffRes.json());
    setWorkers(await workersRes.json());
    setLoading(false);
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newMember, status: "Active", jobsCompleted: 0, performanceRating: 0 }),
    });
    setIsModalOpen(false);
    setNewMember({ name: "", role: "Cleaner", email: "" });
    fetchData();
  };

  const handleCreateWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/workers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        ...newWorker, 
        staffId: selectedStaff.id,
        name: selectedStaff.name
      }),
    });
    setIsWorkerModalOpen(false);
    setNewWorker({ username: "", password: "" });
    setSelectedStaff(null);
    fetchData();
  };

  const getWorkerForStaff = (staffId: string) => {
    return workers.find(w => w.staffId === staffId);
  };

  if (loading) return <div className="section container">Loading...</div>;

  return (
    <div className="section container">
      <div className="flex justify-between items-center mb-lg">
        <h1>Staff Management</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={18} /> Add Staff
        </button>
      </div>

      <div className="grid-3">
        {staff.map((member) => {
          const worker = getWorkerForStaff(member.id);
          return (
            <div key={member.id} className="card">
              <h3 style={{ marginBottom: '0.5rem' }}>{member.name}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{member.role}</p>
              <p style={{ marginBottom: '1rem' }}>{member.email}</p>
              <div className="flex justify-between items-center" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                <span style={{ 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '0.5rem', 
                  background: member.status === 'Active' ? '#dcfce7' : '#f1f5f9',
                  color: member.status === 'Active' ? '#166534' : '#64748b'
                }}>
                  {member.status}
                </span>
                <span>{member.jobsCompleted || 0} Jobs</span>
              </div>
              
              {worker ? (
                <div style={{ padding: '0.75rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)' }}>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}><strong>Worker Login:</strong></p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Username: {worker.username}</p>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setSelectedStaff(member);
                    setIsWorkerModalOpen(true);
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: '0.875rem' }}
                >
                  <Key size={16} /> Create Worker Login
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '400px' }}>
            <h2 className="mb-md">Add New Staff</h2>
            <form onSubmit={handleAddStaff}>
              <div className="form-group">
                <label>Name</label>
                <input required value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input required type="email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} />
              </div>
              <div className="form-group mb-lg">
                <label>Role</label>
                <select value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})}>
                  <option>Cleaner</option>
                  <option>Supervisor</option>
                  <option>Manager</option>
                </select>
              </div>
              <div className="flex justify-between">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Worker Modal */}
      {isWorkerModalOpen && selectedStaff && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '400px' }}>
            <h2 className="mb-md">Create Worker Login for {selectedStaff.name}</h2>
            <form onSubmit={handleCreateWorker}>
              <div className="form-group">
                <label>Username</label>
                <input 
                  required 
                  value={newWorker.username} 
                  onChange={e => setNewWorker({...newWorker, username: e.target.value})}
                  placeholder="e.g., worker1"
                />
              </div>
              <div className="form-group mb-lg">
                <label>Password</label>
                <input 
                  required 
                  type="password"
                  value={newWorker.password} 
                  onChange={e => setNewWorker({...newWorker, password: e.target.value})}
                />
              </div>
              <div className="flex justify-between">
                <button type="button" onClick={() => {
                  setIsWorkerModalOpen(false);
                  setSelectedStaff(null);
                  setNewWorker({ username: "", password: "" });
                }} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Worker</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
