import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'notifications.json');

async function getNotifications() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveNotifications(notifications: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(notifications, null, 2));
}

export async function GET() {
  const notifications = await getNotifications();
  return NextResponse.json(notifications);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const notifications = await getNotifications();
    
    const newNotification = {
      id: `notif-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      status: 'sent'
    };
    
    notifications.unshift(newNotification);
    await saveNotifications(notifications);
    
    return NextResponse.json(newNotification);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
