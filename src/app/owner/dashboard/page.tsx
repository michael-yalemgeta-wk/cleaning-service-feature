"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Users, ShoppingBag, BarChart3, Bell, Clock, Check, Calendar } from "lucide-react";

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

export default function OwnerDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchData();
  }, []);

  if (loading) return <div className="section container">Loading analytics...</div>;

  const { overview, monthlyRevenue, serviceStats, staffPerformance } = analytics;
  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const todayRevenue = overview.totalRevenue || 0;

  // Today's Jobs logic
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysJobs = bookings.filter(b => b.date === todayStr);

  return (
    <div className="section container">
      <h1 className="mb-lg">Business Overview</h1>

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
      
      {/* KPI Cards */}
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
                <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{overview.completedBookings}</h2>
              </div>
              <Check size={32} style={{ opacity: 0.8 }} />
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Retention Rate</p>
                <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{overview.retentionRate}%</h2>
              </div>
              <TrendingUp size={32} style={{ opacity: 0.8 }} />
            </div>
          </div>
      </div>

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
      <div className="card mb-lg" style={{ overflowX: 'auto' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-md)' }}>
        {/* Revenue Trend Chart (Daily) */}
        <div className="card">
          <h3 className="mb-md flex items-center gap-sm">
            <BarChart3 size={20} /> Revenue Trend (Daily)
          </h3>
          <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '1rem', gap: '0.5rem' }}>
            {(() => {
              // Calculate daily revenue from bookings
              const revenueByDay: Record<string, number> = {};
              bookings.forEach(b => {
                if (b.payment?.status === 'Paid' && b.date) {
                  const amount = Number(b.payment.amount) || 0;
                  revenueByDay[b.date] = (revenueByDay[b.date] || 0) + amount;
                }
              });

              const dailyRevenue = Object.entries(revenueByDay)
                .map(([date, revenue]) => ({ date, revenue }))
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(-7); // Last 7 days with revenue

              const maxRevenue = Math.max(...dailyRevenue.map(d => d.revenue), 100); // Default max 100 to avoid div by zero

              if (dailyRevenue.length === 0) {
                 return <div className="w-full h-full flex items-center justify-center text-muted">No revenue data available</div>;
              }

              return dailyRevenue.map((item, i) => {
                const height = (item.revenue / maxRevenue) * 100;
                const displayDate = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                
                return (
                  <div key={i} style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <div style={{ 
                      height: `${height}%`, 
                      background: 'linear-gradient(to top, var(--primary), var(--accent))', 
                      borderRadius: '4px 4px 0 0',
                      minHeight: '20px',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      width: '60%', // Thinner bars for daily
                      margin: '0 auto'
                    }}>
                      <span style={{ 
                        position: 'absolute', 
                        top: '-20px', 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap'
                      }}>
                        ${item.revenue}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: '500', whiteSpace: 'nowrap' }}>{displayDate}</p>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Service Distribution */}
        <div className="card">
          <h3 className="mb-md">Service Popularity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {serviceStats.sort((a: any, b: any) => b.count - a.count).slice(0, 5).map((service: any) => {
              const maxCount = Math.max(...serviceStats.map((s: any) => s.count));
              const percentage = maxCount > 0 ? (service.count / maxCount) * 100 : 0;
              return (
                <div key={service.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{service.name}</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{service.count} bookings</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--surface-alt)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${percentage}%`, 
                      height: '100%', 
                      background: 'var(--primary)',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Staff Performance & Job Lists */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="mb-md">Staff Performance & Job History</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {staffPerformance.map((member: any) => (
              <div key={member.id} style={{ 
                padding: '1rem', 
                background: 'var(--surface-alt)', 
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)'
              }}>
                <div className="flex justify-between items-start mb-sm">
                  <div>
                    <h4 style={{ fontSize: '1.1rem' }}>{member.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{member.role}</p>
                  </div>
                  <div className="text-right">
                    <span style={{ fontWeight: 'bold', color: 'var(--primary)', display: 'block' }}>${member.revenue.toFixed(0)}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Revenue</span>
                  </div>
                </div>

                <div className="flex gap-md mb-md" style={{ fontSize: '0.9rem' }}>
                   <div>
                     <span style={{ fontWeight: 'bold' }}>{member.jobsCompleted}</span> <span className="text-muted">Completed</span>
                   </div>
                </div>
                
                {/* Visual Indicator of load */}
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                   <div style={{ 
                     width: `${Math.min(member.jobsCompleted * 5, 100)}%`, // Arbitrary scale
                     height: '100%', 
                     background: 'var(--success)' 
                   }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
