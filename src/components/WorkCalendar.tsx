"use client";

import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from './Modal';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface WorkCalendarProps {
  role: 'admin' | 'owner' | 'worker' | 'staff';
  staffId?: string;
}

export default function WorkCalendar({ role, staffId }: WorkCalendarProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, staffRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/staff')
      ]);
      
      let allBookings = await bookingsRes.json();
      const allStaff = await staffRes.json();

      // Filter by staff if worker/staff role
      if ((role === 'worker' || role === 'staff') && staffId) {
        allBookings = allBookings.filter((b: any) => b.assignedTo === staffId);
      }

      setBookings(allBookings);
      setStaff(allStaff);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Transform bookings to calendar events
  const events = bookings.map((booking: any) => {
    const [hours, minutes] = booking.time.split(':');
    const startDate = new Date(booking.date);
    startDate.setHours(parseInt(hours), parseInt(minutes));
    
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 2); // Default 2 hour duration

    const staffMember = staff.find(s => s.id === booking.assignedTo);
    
    return {
      id: booking.id,
      title: `${booking.service} - ${booking.name}`,
      start: startDate,
      end: endDate,
      resource: booking,
      staff: staffMember?.name || 'Unassigned',
      status: booking.status
    };
  });

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#fef3c7';
    let color = '#92400e';
    
    switch(event.status) {
      case 'Confirmed':
        backgroundColor = '#dcfce7';
        color = '#166534';
        break;
      case 'In Progress':
        backgroundColor = '#fef9c3';
        color = '#854d0e';
        break;
      case 'On Way':
        backgroundColor = '#ddd6fe';
        color = '#5b21b6';
        break;
      case 'Completed':
        backgroundColor = '#e2e8f0';
        color = '#475569';
        break;
    }

    return {
      style: {
        backgroundColor,
        color,
        borderRadius: '4px',
        border: 'none',
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500'
      }
    };
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  if (loading) return <div>Loading calendar...</div>;

  return (
    <>
      <div style={{ height: '600px', background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          views={['month', 'week', 'day']}
          defaultView="month"
        />
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedEvent(null);
          }}
          title="Booking Details"
          size="md"
        >
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <strong>Service:</strong> {selectedEvent.resource.service}
            </div>
            <div>
              <strong>Customer:</strong> {selectedEvent.resource.name}
            </div>
            <div>
              <strong>Email:</strong> {selectedEvent.resource.email}
            </div>
            <div>
              <strong>Phone:</strong> {selectedEvent.resource.phone}
            </div>
            <div>
              <strong>Address:</strong> {selectedEvent.resource.address}
            </div>
            <div>
              <strong>Date & Time:</strong> {selectedEvent.resource.date} at {selectedEvent.resource.time}
            </div>
            <div>
              <strong>Status:</strong>{' '}
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.875rem',
                background: selectedEvent.status === 'Confirmed' ? '#dcfce7' : selectedEvent.status === 'Completed' ? '#e2e8f0' : '#fef9c3',
                color: selectedEvent.status === 'Confirmed' ? '#166534' : selectedEvent.status === 'Completed' ? '#475569' : '#854d0e'
              }}>
                {selectedEvent.status}
              </span>
            </div>
            <div>
              <strong>Assigned To:</strong> {selectedEvent.staff}
            </div>
            {selectedEvent.resource.payment && (
              <div>
                <strong>Payment:</strong> ${selectedEvent.resource.payment.amount?.toFixed(2)} - {selectedEvent.resource.payment.status}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Calendar Legend */}
      <div className="card mt-md">
        <h3 className="mb-sm">Status Legend</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '20px', background: '#fef3c7', borderRadius: '4px' }}></div>
            <span>Pending</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '20px', background: '#dcfce7', borderRadius: '4px' }}></div>
            <span>Confirmed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '20px', background: '#ddd6fe', borderRadius: '4px' }}></div>
            <span>On Way</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '20px', background: '#fef9c3', borderRadius: '4px' }}></div>
            <span>In Progress</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '20px', height: '20px', background: '#e2e8f0', borderRadius: '4px' }}></div>
            <span>Completed</span>
          </div>
        </div>
      </div>
    </>
  );
}
