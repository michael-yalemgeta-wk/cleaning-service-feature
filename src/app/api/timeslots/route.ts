import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'timeslots.json');

async function getTimeSlots() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { slots: [], settings: {} };
  }
}

async function saveTimeSlots(data: any) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  const data = await getTimeSlots();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentData = await getTimeSlots();
    
    // Merge new data with existing
    const updatedData = { ...currentData, ...body };
    await saveTimeSlots(updatedData);
    
    return NextResponse.json(updatedData);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update time slots' }, { status: 500 });
  }
}
