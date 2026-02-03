"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  Settings, 
  LogOut, 
  TrendingUp, 
  DollarSign, 
  Briefcase,
  Clock,
  Calendar,
  Activity,
  Database,
  Zap,
  ClipboardList,
  Bell,
  User
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Sidebar({ role }: { role: 'admin' | 'owner' | 'worker' }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
    { href: "/admin/staff", label: "Staff", icon: Users },
    { href: "/admin/services", label: "Services", icon: Briefcase },
    { href: "/admin/content", label: "Content", icon: Settings },
    { href: "/admin/time-slots", label: "Time Slots", icon: Clock },
    { href: "/admin/calendar", label: "Calendar", icon: Calendar },
    { href: "/admin/notifications", label: "Notifications", icon: Settings },
    { href: "/admin/settings", label: "Configuration", icon: Settings },
  ];

  const ownerLinks = [
    { href: "/owner/dashboard", label: "Overview", icon: TrendingUp },
    { href: "/owner/notifications", label: "Notifications", icon: Activity },
    { href: "/owner/bookings", label: "Bookings", icon: CalendarCheck },
    { href: "/owner/calendar", label: "Calendar", icon: Calendar },
    { href: "/owner/services", label: "Services", icon: Briefcase },
    { href: "/owner/staff", label: "Staff", icon: Users },
    { href: "/owner/financials", label: "Financials", icon: DollarSign },
    { href: "/owner/settings", label: "Global Settings", icon: Settings },
  ];

  const workerLinks = [
    { href: "/worker/dashboard", label: "Dashboard", icon: ClipboardList },
    { href: "/worker/calendar", label: "My Schedule", icon: Calendar },
    { href: "/worker/notifications", label: "Notifications", icon: Bell },
    { href: "/worker/profile", label: "My Profile", icon: User },
  ];

  const links = role === 'owner' ? ownerLinks : role === 'worker' ? workerLinks : adminLinks;

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isOwner");
    localStorage.removeItem("isWorker");
    localStorage.removeItem("workerId");
    localStorage.removeItem("workerName");
    localStorage.removeItem("workerStaffId");
    router.push("/login");
  };

  return (
    <div style={{ 
      width: '250px', 
      background: 'var(--secondary)', 
      color: 'var(--text-inverted)', 
      minHeight: '100vh',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '3rem', paddingLeft: '1rem' }}>
        {role === 'owner' ? 'Owner Portal' : 'Admin Portal'}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 400
              }}
            >
              <Icon size={20} />
              {link.label}
            </Link>
          );
        })}
      </div>

      <button 
        onClick={handleLogout}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            marginTop: 'auto'
        }}
      >
        <LogOut size={20} />
        Logout
      </button>

      {role === 'admin' && <SystemHealth />}
    </div>
  );
}

function SystemHealth() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'connected' | 'error'>('idle');
  const [speed, setSpeed] = useState<number | null>(null);

  const checkSystem = async () => {
    setStatus('checking');
    setSpeed(null);
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      const end = performance.now();
      setSpeed(Math.round(end - start));
      
      if (res.ok) {
        setStatus('connected');
      } else {
        setStatus('error');
      }
    } catch (e) {
      setStatus('error');
    }
  };

  const getColor = () => {
    if (status === 'checking') return '#fbbf24'; // yellow
    if (status === 'connected') return '#22c55e'; // green
    if (status === 'error') return '#ef4444'; // red
    return '#94a3b8'; // gray
  };

  return (
    <div style={{ 
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: '0.5rem',
        paddingTop: '1rem'
    }}>
      <div style={{ paddingLeft: '1rem', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>SYSTEM STATUS</span>
        <button 
           onClick={checkSystem}
           disabled={status === 'checking'}
           title="Reload Status"
           style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0 }}
        >
           <Activity size={14} />
        </button>
      </div>

      <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Database size={14} />
          <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: getColor(),
              boxShadow: status === 'connected' ? `0 0 5px ${getColor()}` : 'none'
          }} />
          <span>{status === 'idle' ? 'Unknown' : status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </div>
        
        {speed !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
             <Zap size={14} />
             <span>Speed: {speed}ms</span>
          </div>
        )}
      </div>
    </div>
  );
}
