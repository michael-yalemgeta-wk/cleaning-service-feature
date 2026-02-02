import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'tasks.json');

async function getTasks() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveTasks(tasks: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2));
}

export async function GET() {
  const tasks = await getTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tasks = await getTasks();
    const newTask = { 
      ...body, 
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: body.status || 'Pending'
    };
    tasks.push(newTask);
    await saveTasks(tasks);
    return NextResponse.json(newTask);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to add task' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    let tasks = await getTasks();
    tasks = tasks.map((t: any) => t.id === body.id ? { ...t, ...body } : t);
    await saveTasks(tasks);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
