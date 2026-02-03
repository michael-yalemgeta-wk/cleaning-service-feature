import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const staffId = searchParams.get('staffId');
    const time = searchParams.get('time');
    const excludeBookingId = searchParams.get('excludeBookingId');

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // If staffId and time are provided, check specific availability for that staff member
    if (staffId && time) {
      const existingBooking = await prisma.booking.findFirst({
        where: {
          date,
          time,
          assignedTo: staffId,
          id: excludeBookingId ? { not: excludeBookingId } : undefined,
          status: {
            notIn: ['Cancelled', 'Done'] // Only count active/upcoming bookings
          }
        }
      });

      return NextResponse.json({ available: !existingBooking });
    }

    // Otherwise, return general availability slots for the date
    // Default basic timeslots
    const defaultSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

    // Get all bookings for this date to see taken slots
    const bookings = await prisma.booking.findMany({
      where: { 
        date,
        status: { not: 'Cancelled' }
      },
      select: { time: true },
    });
        
    const bookedTimes = bookings.map((b: { time: string | null }) => b.time);
    
    const availableSlots = defaultSlots.map(time => ({
      time,
      available: !bookedTimes.includes(time)
    }));

    return NextResponse.json(availableSlots);
  } catch (error) {
    console.error('Availability API error:', error);
    return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 });
  }
}
