"use client";

import { useEffect, useState } from "react";
import { Bell, Mail, MessageSquare, Calendar } from "lucide-react";

export default function WorkerNotificationCenter() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [workerStaffId, setWorkerStaffId] = useState("");

  useEffect(() => {
    const sid = localStorage.getItem("workerStaffId");
    if (sid) {
        setWorkerStaffId(sid);
        fetchNotifications(sid);
    } else {
        setLoading(false);
    }
  }, []);

  const fetchNotifications = async (sid: string) => {
    try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        
        // Filter notifications for this worker
        const myNotifications = data.filter((n: any) => 
            // 1. Direct recipient
            n.recipient === sid || 
            // 2. Sent to all staff (if implemented later) or recipientType is 'staff'
            n.recipientType === 'staff'
        );
        
        setNotifications(myNotifications);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking_confirmation':
        return <Calendar size={20} />;
      case 'job_assignment':
        return <Bell size={20} />;
      case 'reminder':
        return <MessageSquare size={20} />;
      default:
        return <Mail size={20} />;
    }
  };

  if (loading) return <div className="section container">Loading...</div>;

  return (
    <div className="section container">
      <h1 className="mb-lg flex items-center gap-sm">
        <Bell /> My Notifications
      </h1>

      {notifications.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No notifications yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              style={{ 
                padding: '1rem', 
                border: notif.priority === 'critical' ? '1px solid #fca5a5' : '1px solid var(--border)', 
                background: notif.priority === 'critical' ? '#fef2f2' : notif.priority === 'high' ? '#fff7ed' : 'var(--surface)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                gap: '1rem',
                alignItems: 'start'
              }}
            >
              <div style={{ 
                padding: '0.75rem', 
                background: notif.priority === 'critical' ? '#fee2e2' : 'var(--surface-alt)', 
                borderRadius: '50%',
                color: notif.priority === 'critical' ? '#b91c1c' : 'var(--primary)'
              }}>
                {getIcon(notif.type)}
              </div>
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h4 style={{ color: notif.priority === 'critical' ? '#b91c1c' : 'inherit' }}>{notif.title}</h4>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap'
                  }}>
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  {notif.message}
                </p>
                {notif.priority === 'critical' && <span style={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '0.8rem' }}>! Urgent</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
