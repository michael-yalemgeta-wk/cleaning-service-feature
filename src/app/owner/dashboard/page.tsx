"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Users, ShoppingBag, BarChart3 } from "lucide-react";

export default function OwnerDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then(res => res.json())
      .then(data => {
        setAnalytics(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="section container">Loading analytics...</div>;

  const { overview, monthlyRevenue, serviceStats, staffPerformance } = analytics;

  return (
    <div className="section container">
      <h1 className="mb-lg">Business Overview</h1>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--primary)', color: 'white', borderRadius: '50%' }}>
            <DollarSign size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Revenue</p>
            <h2 style={{ fontSize: '2rem', margin: 0 }}>${overview.totalRevenue.toLocaleString()}</h2>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--accent)', color: 'white', borderRadius: '50%' }}>
            <ShoppingBag size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Bookings</p>
            <h2 style={{ fontSize: '2rem', margin: 0 }}>{overview.totalBookings}</h2>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#3b82f6', color: 'white', borderRadius: '50%' }}>
            <Users size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Unique Customers</p>
            <h2 style={{ fontSize: '2rem', margin: 0 }}>{overview.uniqueCustomers}</h2>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#10b981', color: 'white', borderRadius: '50%' }}>
            <TrendingUp size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Retention Rate</p>
            <h2 style={{ fontSize: '2rem', margin: 0 }}>{overview.retentionRate}%</h2>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-md)' }}>
        {/* Revenue Trend Chart */}
        <div className="card">
          <h3 className="mb-md flex items-center gap-sm">
            <BarChart3 size={20} /> Revenue Trend (Last 6 Months)
          </h3>
          <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '1rem', gap: '0.5rem' }}>
            {monthlyRevenue.map((item: any, i: number) => {
              const maxRevenue = Math.max(...monthlyRevenue.map((m: any) => m.revenue));
              const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={i} style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div style={{ 
                    height: `${height}%`, 
                    background: 'linear-gradient(to top, var(--primary), var(--accent))', 
                    borderRadius: '4px 4px 0 0',
                    minHeight: '20px',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}>
                    <span style={{ 
                      position: 'absolute', 
                      top: '-20px', 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      ${item.revenue}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: '500' }}>{item.month}</p>
                </div>
              );
            })}
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

        {/* Staff Performance */}
        <div className="card">
          <h3 className="mb-md">Staff Performance</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {staffPerformance.sort((a: any, b: any) => b.jobsCompleted - a.jobsCompleted).slice(0, 5).map((member: any) => (
              <div key={member.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{member.name}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{member.jobsCompleted} jobs completed</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 'bold', color: 'var(--primary)' }}>${member.revenue.toFixed(0)}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
