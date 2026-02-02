import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'workers.json');

async function getWorkers() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveWorkers(workers: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(workers, null, 2));
}

export async function GET() {
  const workers = await getWorkers();
  // Don't send passwords to client
  const sanitized = workers.map(({ password, ...rest }: any) => rest);
  return NextResponse.json(sanitized);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Handle login
    if (body.action === 'login') {
      const workers = await getWorkers();
      const worker = workers.find((w: any) => w.username === body.username && w.password === body.password);
      if (worker) {
        const { password, ...workerData } = worker;
        return NextResponse.json({ success: true, worker: workerData });
      }
      return NextResponse.json({ success: false }, { status: 401 });
    }
    
    // Handle create worker
    const workers = await getWorkers();
    const newWorker = { 
      ...body, 
      id: `worker-${Date.now()}`
    };
    workers.push(newWorker);
    await saveWorkers(workers);
    const { password, ...workerData } = newWorker;
    return NextResponse.json(workerData);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    let workers = await getWorkers();
    workers = workers.map((w: any) => w.id === body.id ? { ...w, ...body } : w);
    await saveWorkers(workers);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update worker' }, { status: 500 });
  }
}
