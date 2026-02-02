"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock, LogOut, TrendingUp, DollarSign } from "lucide-react";

type Booking = {
  id: string;
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  status: string;
  assignedTo?: string;
  tasks?: string[];
  createdAt: string;
  payment?: any;
};

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
      const [bookingsRes, analyticsRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/analytics")
      ]);
      const bookingsData = await bookingsRes.json();
      const analyticsData = await analyticsRes.json();
      
      setBookings(bookingsData.reverse());
      setAnalytics(analyticsData);
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

  const logout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/login");
  };

  if (loading) return <div className="container section text-center">Loading...</div>;

  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const todayRevenue = analytics?.overview?.totalRevenue || 0;

  return (
    <div className="section container">
      <div className="flex justify-between items-center mb-lg">
        <h1>Admin Dashboard</h1>
        <button onClick={logout} className="btn btn-secondary flex items-center gap-sm">
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Quick Stats */}
      {analytics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0d9488 100%)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Pending Bookings</p>
                <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{pendingBookings.length}</h2>
              </div>
              <Clock size={32} style={{ opacity: 0.8 }} />
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #f59e0b 100%)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Revenue</p>
                <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>${todayRevenue.toLocaleString()}</h2>
              </div>
              <DollarSign size={32} style={{ opacity: 0.8 }} />
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Completed</p>
                <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{analytics.overview.completedBookings}</h2>
              </div>
              <Check size={32} style={{ opacity: 0.8 }} />
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Retention Rate</p>
                <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{analytics.overview.retentionRate}%</h2>
              </div>
              <TrendingUp size={32} style={{ opacity: 0.8 }} />
            </div>
          </div>
        </div>
      )}

      {/* Recent Bookings Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <h2 className="mb-md">Recent Bookings</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Date/Time</th>
              <th style={{ padding: '1rem' }}>Customer</th>
              <th style={{ padding: '1rem' }}>Service</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                 <td colSpan={5} className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>No bookings found.</td>
              </tr>
            ) : (
                bookings.slice(0, 10).map((booking) => (
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
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {booking.status !== 'Confirmed' && booking.status !== 'Completed' && (
                          <button onClick={() => updateStatus(booking.id, 'Confirmed')} className="btn btn-primary" style={{ padding: '0.5rem', fontSize: '0.875rem' }} title="Confirm">
                            <Check size={16} />
                          </button>
                        )}
                        {booking.status !== 'Completed' && (
                          <button onClick={() => updateStatus(booking.id, 'Completed')} className="btn btn-secondary" style={{ padding: '0.5rem', fontSize: '0.875rem' }} title="Complete">
                            <Clock size={16} />
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
    </div>
  );
}
