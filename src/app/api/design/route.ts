import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const designFilePath = path.join(process.cwd(), 'data', 'design.json');

async function getDesign() {
  try {
    const data = await fs.readFile(designFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Return defaults if file doesn't exist
    return {
      colors: {
        primary: "#0f766e",
        secondary: "#1e293b",
        accent: "#d97706",
        background: "#f8fafc",
        surface: "#ffffff"
      },
      ui: {
        borderRadius: "0.5rem",
        buttonStyle: "rounded" 
      },
      darkMode: {
        enabled: true
      }
    };
  }
}

export async function GET() {
  const design = await getDesign();
  return NextResponse.json(design);
}

export async function POST(request: Request) {
  try {
    const newDesign = await request.json();
    await fs.writeFile(designFilePath, JSON.stringify(newDesign, null, 2));
    return NextResponse.json({ success: true, design: newDesign });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update design' }, { status: 500 });
  }
}
