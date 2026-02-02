import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'locations.json');

async function getLocations() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveLocations(locations: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(locations, null, 2));
}

export async function GET() {
  const locations = await getLocations();
  return NextResponse.json(locations);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const locations = await getLocations();
    const newLocation = { 
      ...body, 
      id: `loc-${Date.now()}`,
      active: true
    };
    locations.push(newLocation);
    await saveLocations(locations);
    return NextResponse.json(newLocation);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to add location' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    let locations = await getLocations();
    locations = locations.map((l: any) => l.id === body.id ? { ...l, ...body } : l);
    await saveLocations(locations);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 });
  }
}
