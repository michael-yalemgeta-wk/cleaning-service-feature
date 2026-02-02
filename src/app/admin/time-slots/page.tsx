"use client";

import { useEffect, useState } from "react";
import { Clock, Plus, Save, Trash2 } from "lucide-react";
import Modal from "@/components/Modal";

export default function TimeSlotsPage() {
  const [timeSlots, setTimeSlots] = useState<any>({ slots: [], settings: {} });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<any>(null);
  const [newSlot, setNewSlot] = useState({ time: "", duration: 120, enabled: true });

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    const res = await fetch("/api/timeslots");
    const data = await res.json();
    setTimeSlots(data);
    setLoading(false);
  };

  const handleSaveSlot = async () => {
    let updatedSlots = [...timeSlots.slots];
    
    if (editingSlot) {
      const index = updatedSlots.findIndex(s => s.id === editingSlot.id);
      updatedSlots[index] = { ...editingSlot, ...newSlot };
    } else {
      updatedSlots.push({
        id: `slot-${Date.now()}`,
        ...newSlot
      });
    }

    const updated = { ...timeSlots, slots: updatedSlots };
    await fetch("/api/timeslots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });

    setModalOpen(false);
    setEditingSlot(null);
    setNewSlot({ time: "", duration: 120, enabled: true });
    fetchTimeSlots();
  };

  const handleDeleteSlot = async (slotId: string) => {
    const updatedSlots = timeSlots.slots.filter((s: any) => s.id !== slotId);
    const updated = { ...timeSlots, slots: updatedSlots };
    
    await fetch("/api/timeslots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });
    
    fetchTimeSlots();
  };

  const handleToggleSlot = async (slotId: string) => {
    const updatedSlots = timeSlots.slots.map((s: any) => 
      s.id === slotId ? { ...s, enabled: !s.enabled } : s
    );
    const updated = { ...timeSlots, slots: updatedSlots };
    
    await fetch("/api/timeslots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });
    
    fetchTimeSlots();
  };

  const handleSaveSettings = async () => {
    await fetch("/api/timeslots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(timeSlots)
    });
    alert("Settings saved successfully!");
  };

  if (loading) return <div className="section container">Loading...</div>;

  return (
    <div className="section container">
      <h1 className="mb-lg flex items-center gap-sm">
        <Clock /> Time Slot Management
      </h1>

      <div style={{ display: 'grid', gap: '2rem' }}>
        
        {/* Time Slots */}
        <div className="card">
          <div className="flex justify-between items-center mb-md">
            <h2>Available Time Slots</h2>
            <button 
              onClick={() => {
                setEditingSlot(null);
                setNewSlot({ time: "", duration: 120, enabled: true });
                setModalOpen(true);
              }}
              className="btn btn-primary"
            >
              <Plus size={18} /> Add Time Slot
            </button>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {timeSlots.slots.length === 0 && (
              <p className="text-muted">No time slots configured.</p>
            )}
            {timeSlots.slots.map((slot: any) => (
              <div 
                key={slot.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  background: slot.enabled ? 'transparent' : 'var(--surface-alt)',
                  opacity: slot.enabled ? 1 : 0.6
                }}
              >
                <div>
                  <strong>{slot.time}</strong>
                  <span style={{ marginLeft: '1rem', color: 'var(--text-muted)' }}>
                    ({slot.duration} minutes)
                  </span>
                  {!slot.enabled && (
                    <span style={{ 
                      marginLeft: '0.5rem', 
                      padding: '0.25rem 0.5rem', 
                      background: '#fee2e2', 
                      color: '#991b1b', 
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem'
                    }}>
                      Disabled
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => handleToggleSlot(slot.id)}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    {slot.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button 
                    onClick={() => {
                      setEditingSlot(slot);
                      setNewSlot({ time: slot.time, duration: slot.duration, enabled: slot.enabled });
                      setModalOpen(true);
                    }}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="btn"
                    style={{ padding: '0.5rem 1rem', background: '#ef4444', color: 'white' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Settings */}
        <div className="card">
          <h2 className="mb-md">Global Time Settings</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Default Slot Duration (minutes)</label>
              <input 
                type="number"
                value={timeSlots.settings.slotDuration || 120}
                onChange={(e) => setTimeSlots({
                  ...timeSlots,
                  settings: { ...timeSlots.settings, slotDuration: parseInt(e.target.value) }
                })}
              />
            </div>
            <div className="form-group">
              <label>Buffer Time (minutes)</label>
              <input 
                type="number"
                value={timeSlots.settings.bufferTime || 30}
                onChange={(e) => setTimeSlots({
                  ...timeSlots,
                  settings: { ...timeSlots.settings, bufferTime: parseInt(e.target.value) }
                })}
              />
            </div>
            <div className="form-group">
              <label>Work Start Time</label>
              <input 
                type="time"
                value={timeSlots.settings.workStartTime || "08:00"}
                onChange={(e) => setTimeSlots({
                  ...timeSlots,
                  settings: { ...timeSlots.settings, workStartTime: e.target.value }
                })}
              />
            </div>
            <div className="form-group">
              <label>Work End Time</label>
              <input 
                type="time"
                value={timeSlots.settings.workEndTime || "18:00"}
                onChange={(e) => setTimeSlots({
                  ...timeSlots,
                  settings: { ...timeSlots.settings, workEndTime: e.target.value }
                })}
              />
            </div>
          </div>

          <button onClick={handleSaveSettings} className="btn btn-primary mt-md">
            <Save size={18} /> Save Global Settings
          </button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        title={editingSlot ? "Edit Time Slot" : "Add New Time Slot"}
        size="sm"
      >
        <div className="form-group">
          <label>Time</label>
          <input 
            type="time"
            value={newSlot.time}
            onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
          />
        </div>
        <div className="form-group mb-lg">
          <label>Duration (minutes)</label>
          <input 
            type="number"
            value={newSlot.duration}
            onChange={(e) => setNewSlot({ ...newSlot, duration: parseInt(e.target.value) })}
            step="30"
          />
        </div>
        <div className="flex justify-end gap-sm">
          <button onClick={() => setModalOpen(false)} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleSaveSlot} className="btn btn-primary">
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
}
