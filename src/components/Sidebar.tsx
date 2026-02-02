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
  Briefcase 
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Sidebar({ role }: { role: 'admin' | 'owner' }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
    { href: "/admin/staff", label: "Staff", icon: Users },
    { href: "/admin/services", label: "Services", icon: Briefcase },
    { href: "/admin/content", label: "Content", icon: Settings },
    { href: "/admin/notifications", label: "Notifications", icon: Settings },
  ];

  const ownerLinks = [
    { href: "/owner/dashboard", label: "Overview", icon: TrendingUp },
    { href: "/owner/financials", label: "Financials", icon: DollarSign },
    { href: "/owner/settings", label: "Global Settings", icon: Settings },
  ];

  const links = role === 'owner' ? ownerLinks : adminLinks;

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isOwner");
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
    </div>
  );
}
