"use client";

import { useState, useEffect, Suspense } from "react";
import { Search, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Separate component for search functionality
function BookingsSearch() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
      performSearch(emailParam);
    }
  }, [searchParams]);

  const performSearch = async (searchEmail: string) => {
    setLoading(true);
    setSearched(true);
    
    try {
      const res = await fetch("/api/bookings");
      const allBookings = await res.json();
      const customerBookings = allBookings.filter((b: any) => 
        b.email.toLowerCase() === searchEmail.toLowerCase()
      );
      setBookings(customerBookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(email);
  };

  return (
    <>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
        <h2 className="mb-md">Find Your Bookings</h2>
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            <Search size={18} /> {loading ? "Searching..." : "Find My Bookings"}
          </button>
        </form>
      </div>

      {searched && (
        <div>
          {bookings.length === 0 ? (
            <div className="card text-center" style={{ padding: '3rem' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No bookings found for this email.</p>
              <Link href="/book" className="btn btn-primary">Book a Service</Link>
            </div>
          ) : (
            <div>
              <h2 className="mb-md">{bookings.length} Booking{bookings.length !== 1 ? 's' : ''} Found</h2>
              <div className="grid-3">
                {bookings.map((booking) => (
                  <div key={booking.id} className="card">
                    <div className="flex justify-between items-center mb-md">
                      <h3>{booking.service}</h3>
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
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Calendar size={16} /> {booking.date} at {booking.time}
                      </p>
                      {booking.payment && (
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <DollarSign size={16} /> ${booking.payment.amount?.toFixed(2)} - {booking.payment.status}
                        </p>
                      )}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      {booking.address}
                    </p>
                    {booking.status === 'Completed' && (
                      <Link 
                        href={`/book?service=${booking.service}`} 
                        className="btn btn-secondary" 
                        style={{ width: '100%', fontSize: '0.9rem' }}
                      >
                        Book Again
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function CustomerBookings() {
  return (
    <div className="container section">
      <h1 className="text-center mb-lg">My Bookings</h1>
      <Suspense fallback={<div>Loading search...</div>}>
        <BookingsSearch />
      </Suspense>
    </div>
  );
}
