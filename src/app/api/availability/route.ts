import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json');

async function getBookings() {
  try {
    const data = await fs.readFile(BOOKINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');
    const date = searchParams.get('date');
    const time = searchParams.get('time');

    if (!staffId || !date || !time) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const bookings = await getBookings();
    
    // Check if staff member has a booking at this time
    const conflictingBooking = bookings.find((b: any) => 
      b.assignedTo === staffId && 
      b.date === date && 
      b.time === time &&
      b.status !== 'Completed' &&
      b.status !== 'Cancelled'
    );

    return NextResponse.json({
      available: !conflictingBooking,
      conflictingBooking: conflictingBooking || null
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 });
  }
}
