import { NextRequest, NextResponse } from 'next/server';

const SCRIPT_URL = process.env.GOOGLE_SHEET_SCRIPT_URL!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Google Apps Script accepte mieux les données en form-urlencoded
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ data: JSON.stringify(body) }).toString(),
      redirect: 'follow',
    });

    const text = await res.text();
    return NextResponse.json({ success: true, raw: text });
  } catch (err) {
    console.error('Google Sheet error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
