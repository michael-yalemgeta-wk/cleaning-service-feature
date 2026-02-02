import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Helper to get path
const DATA_FILE = path.join(process.cwd(), 'data', 'bookings.json');

async function getBookings() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveBookings(bookings: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(bookings, null, 2));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simple validation
    if (!body.service || !body.date || !body.name || !body.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const bookings = await getBookings();
    
    const newBooking = {
      id: Date.now().toString(),
      ...body,
      status: 'Pending', // Pending, Confirmed, Completed
      createdAt: new Date().toISOString(),
    };
    
    bookings.push(newBooking);
    await saveBookings(bookings);
    
    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error('Booking Error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET() {
  const bookings = await getBookings();
  return NextResponse.json(bookings);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    
    if (!id || !status) {
       return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const bookings = await getBookings();
    const index = bookings.findIndex((b: any) => b.id === id);
    
    if (index === -1) {
       return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    bookings[index].status = status;
    await saveBookings(bookings);
    
    return NextResponse.json(bookings[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
