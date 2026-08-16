import { NextRequest, NextResponse } from 'next/server';

const SCRIPT_URL = process.env.GOOGLE_SHEET_SCRIPT_URL!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Google Sheet error:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
