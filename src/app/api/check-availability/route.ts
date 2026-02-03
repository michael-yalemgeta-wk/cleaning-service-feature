import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    // Find all bookings for the specified date (excluding cancelled ones)
    const bookings = await prisma.booking.findMany({
      where: {
        date: date,
        status: {
          not: 'Cancelled'
        }
      },
      select: {
        time: true,
        service: true
      }
    });

    // Extract the booked time slots
    const bookedSlots = bookings.map(booking => booking.time);

    return NextResponse.json({ 
      date,
      bookedSlots,
      count: bookedSlots.length
    });
  } catch (error) {
    console.error('Check availability error:', error);
    return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 });
  }
}
