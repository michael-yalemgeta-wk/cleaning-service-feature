"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock, LogOut, Plus, UserPlus } from "lucide-react";
import Modal from "@/components/Modal";

type Booking = {
  id: string;
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  address: string;
  status: string;
  assignedTo?: string;
  tasks?: string[];
  payment?: {
    method: string;
    amount: number;
    status: string;
  };
  createdAt: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      router.push("/login");
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const bookingsRes = await fetch("/api/bookings");
      const staffRes = await fetch("/api/staff");
      const data = await bookingsRes.json();
      setBookings(data.reverse());
      setStaff(await staffRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/bookings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchData();
  };

  const assignStaff = async (bookingId: string, staffId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Check availability
    if (staffId) {
      const availRes = await fetch(`/api/availability?staffId=${staffId}&date=${booking.date}&time=${booking.time}`);
      const availData = await availRes.json();
      
      if (!availData.available) {
        alert(`This staff member is already booked at ${booking.time} on ${booking.date}. Please choose a different time or staff member.`);
        return;
      }
    }

    await fetch("/api/bookings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bookingId, assignedTo: staffId, status: staffId ? "In Progress" : "Pending" }),
    });
    fetchData();
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const booking = bookings.find(b => b.id === selectedBooking);
    if (!booking) return;

    const taskRes = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        ...newTask, 
        bookingId: selectedBooking,
        assignedTo: booking.assignedTo,
        status: "Pending"
      }),
    });

    setTaskModalOpen(false);
    setNewTask({ title: "", description: "" });
    fetchData();
  };

  const getStaffName = (staffId?: string) => {
    if (!staffId) return "Unassigned";
    const member = staff.find(s => s.id === staffId);
    return member ? member.name : "Unknown";
  };

  if (loading) return <div className="container section text-center">Loading...</div>;

  return (
    <div className="section container">
      <h1 className="mb-lg">Booking Management</h1>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Date/Time</th>
              <th style={{ padding: '1rem' }}>Customer</th>
              <th style={{ padding: '1rem' }}>Service</th>
              <th style={{ padding: '1rem' }}>Assigned To</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>No bookings found.</td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.875rem',
                      background: booking.status === 'Confirmed' ? '#dcfce7' : booking.status === 'Completed' ? '#e2e8f0' : booking.status === 'In Progress' ? '#fef9c3' : '#fef3c7',
                      color: booking.status === 'Confirmed' ? '#166534' : booking.status === 'Completed' ? '#475569' : booking.status === 'In Progress' ? '#854d0e' : '#92400e',
                      fontWeight: 'bold'
                    }}>
                      {booking.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div>{booking.date}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{booking.time}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '500' }}>{booking.name}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{booking.email}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{booking.service}</td>
                  <td style={{ padding: '1rem' }}>
                    {booking.assignedTo ? (
                      <div className="flex items-center gap-sm">
                        <span>{getStaffName(booking.assignedTo)}</span>
                        <button 
                             onClick={() => assignStaff(booking.id, "")}
                             style={{ fontSize: '0.8rem', color: 'var(--text-muted)', border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                            (Change)
                        </button>
                      </div>
                    ) : (
                      <select 
                        onChange={(e) => assignStaff(booking.id, e.target.value)}
                        style={{ fontSize: '0.875rem' }}
                        value=""
                      >
                        <option value="" disabled>Assign Staff...</option>
                        {staff.filter(s => s.status === 'Active').map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {booking.status === 'Pending' && (
                        <button 
                          onClick={() => updateStatus(booking.id, 'Confirmed')} 
                          className="btn btn-primary" 
                          style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                          title="Confirm"
                        >
                          <Check size={16} /> Confirm
                        </button>
                      )}
                      {booking.status === 'Confirmed' && (
                         <button 
                           onClick={() => updateStatus(booking.id, 'On Way')} 
                           className="btn" 
                           style={{ padding: '0.5rem', fontSize: '0.875rem', background: '#3b82f6', color: 'white' }}
                           title="On Way"
                         >
                           🚗 On Way
                         </button>
                      )}
                      
                      {/* Mark Paid Button */}
                      {booking.payment?.status !== 'Paid' && (
                         <button 
                           onClick={async () => {
                               await fetch("/api/bookings", {
                                 method: "PUT",
                                 headers: { "Content-Type": "application/json" },
                                 body: JSON.stringify({ id: booking.id, payment: { status: 'Paid' } }),
                               });
                               fetchData();
                           }}
                           className="btn" 
                           style={{ padding: '0.5rem', fontSize: '0.875rem', background: '#10b981', color: 'white' }}
                           title="Mark Paid"
                         >
                           💰 Paid
                         </button>
                      )}

                      {booking.assignedTo && booking.status !== 'Completed' && (
                        <button 
                          onClick={() => {
                            setSelectedBooking(booking.id);
                            setTaskModalOpen(true);
                          }} 
                          className="btn btn-secondary" 
                          style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                          title="Add Task"
                        >
                          <Plus size={16} /> Task
                        </button>
                      )}
                      
                      {booking.status !== 'Completed' && booking.status !== 'Pending' && (
                         <button 
                           onClick={() => updateStatus(booking.id, 'Completed')} 
                           className="btn btn-secondary" 
                           style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                           title="Complete"
                         >
                           <Check size={16} /> Done
                         </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setNewTask({ title: "", description: "" });
        }}
        title="Add Task"
        size="sm"
      >
        <form onSubmit={addTask}>
          <div className="form-group">
            <label>Task Title</label>
            <input 
              required 
              value={newTask.title} 
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              placeholder="e.g., Clean kitchen"
            />
          </div>
          <div className="form-group mb-lg">
            <label>Description</label>
            <textarea 
              required
              value={newTask.description} 
              onChange={e => setNewTask({...newTask, description: e.target.value})}
              placeholder="Task details..."
              rows={3}
            ></textarea>
          </div>
          <div className="flex justify-end gap-sm">
            <button type="button" onClick={() => {
              setTaskModalOpen(false);
              setNewTask({ title: "", description: "" });
            }} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Add Task</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
