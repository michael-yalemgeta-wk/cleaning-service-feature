import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'content.json');

async function getContent() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

async function saveContent(content: any) {
  await fs.writeFile(DATA_FILE, JSON.stringify(content, null, 2));
}

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await saveContent(body);
    return NextResponse.json(body);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
