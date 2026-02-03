"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock, LogOut, TrendingUp, DollarSign, Bell, Calendar } from "lucide-react";

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

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  priority?: string;
};

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
      const [bookingsRes, analyticsRes, notificationsRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/analytics"),
        fetch("/api/notifications"),
      ]);
      const bookingsData = await bookingsRes.json();
      const analyticsData = await analyticsRes.json();
      const notificationsData = await notificationsRes.json();
      
      setBookings(bookingsData.reverse());
      setAnalytics(analyticsData);
      setNotifications(notificationsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/login");
  };

  if (loading) return <div className="container section text-center">Loading...</div>;

  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const todayRevenue = analytics?.overview?.totalRevenue || 0;
  
  // Today's Jobs logic
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysJobs = bookings.filter(b => b.date === todayStr);

  return (
    <div className="section container">
      <div className="flex justify-between items-center mb-lg">
        <h1>Admin Dashboard</h1>
        <button onClick={logout} className="btn btn-secondary flex items-center gap-sm">
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Important Notifications */}
      {notifications.length > 0 && (
        <div className="mb-lg">
          <h2 className="mb-md flex items-center gap-sm">
            <Bell size={24} className="text-primary" /> Important Notifications
          </h2>
          <div className="flex flex-col gap-sm">
            {notifications.slice(0, 3).map((notif) => (
              <div 
                key={notif.id} 
                className="card" 
                style={{ 
                  padding: '1rem', 
                  borderLeft: `4px solid ${notif.priority === 'critical' ? '#ef4444' : notif.priority === 'high' ? '#f59e0b' : '#3b82f6'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>{notif.title}</h4>
                  <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{notif.message}</p>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {new Date(notif.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* Today's Jobs */}
      <div className="mb-lg">
        <h2 className="mb-md flex items-center gap-sm">
            <Calendar size={24} className="text-primary" /> Today's Jobs ({todaysJobs.length})
        </h2>
        {todaysJobs.length === 0 ? (
             <div className="card text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
                No jobs scheduled for today.
             </div>
        ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-md)' }}>
                {todaysJobs.map(booking => (
                    <div key={booking.id} className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                        <div className="flex justify-between items-start mb-sm">
                             <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{booking.time}</div>
                             <span style={{ 
                                padding: '0.2rem 0.5rem', 
                                borderRadius: '1rem', 
                                fontSize: '0.75rem', 
                                background: booking.status === 'Completed' ? '#e2e8f0' : '#dcfce7',
                                color: booking.status === 'Completed' ? '#475569' : '#166534',
                                fontWeight: 'bold'
                            }}>
                                {booking.status}
                            </span>
                        </div>
                        <h4 style={{ margin: '0 0 0.5rem' }}>{booking.name}</h4>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                            {booking.service}
                        </div>
                         {booking.assignedTo && (
                             <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></div>
                                 Assigned
                             </div>
                         )}
                    </div>
                ))}
            </div>
        )}
      </div>

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
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                 <td colSpan={4} className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>No bookings found.</td>
              </tr>
            ) : (
                bookings.slice(0, 4).map((booking) => (
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
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
