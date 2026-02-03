import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simple validation
    if (!body.service || !body.date || !body.name || !body.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check for existing bookings at the same date and time to prevent double booking
    if (body.date && body.time) {
      const existingBooking = await prisma.booking.findFirst({
        where: {
          date: body.date,
          time: body.time,
          status: {
            not: 'Cancelled' // Don't count cancelled bookings
          }
        }
      });

      if (existingBooking) {
        return NextResponse.json({ 
          error: 'This time slot is already booked. Please select a different time.',
          code: 'SLOT_UNAVAILABLE'
        }, { status: 409 }); // 409 Conflict
      }
    }

    // Generate unique cleaning code
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const cleaningCode = `CLN-${timestamp}-${randomStr}`;
    
    const newBooking = await prisma.booking.create({
      data: {
        id: timestamp.toString(),
        ...body,
        cleaningCode,
        status: 'Pending', 
        payment: {
          status: 'Unpaid',
          amount: body.payment?.amount || 0,
          method: body.payment?.method || 'Cash'
        },
      },
    });
    
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Booking Error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, assignedTo, payment } = body;
    
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    
    // Fetch existing validation to handle partial updates properly
    const existing = await prisma.booking.findUnique({
      where: { id },
    });
        
    if (!existing) {
       return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    const updates: any = {};
    if (status) updates.status = status;
    if (assignedTo !== undefined) updates.assignedTo = assignedTo;
    
    // Merge payment object if provided
    if (payment) {
        // @ts-ignore
        const currentPayment = existing.payment as any || {};
        updates.payment = { ...currentPayment, ...payment };
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: updates,
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const deleteAll = searchParams.get('deleteAll');

    if (deleteAll === 'true') {
      await prisma.booking.deleteMany({
        where: { id: { not: '0' } } // effectively deletes all
      });
      return NextResponse.json({ success: true, message: 'All bookings deleted' });
    }

    if (id) {
      await prisma.booking.delete({
        where: { id },
      });
      return NextResponse.json({ success: true, message: 'Booking deleted' });
    }

    return NextResponse.json({ error: 'Missing id or deleteAll param' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
