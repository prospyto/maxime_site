import { NextRequest, NextResponse } from 'next/server';

const SCRIPT_URL = process.env.GOOGLE_SHEET_SCRIPT_URL!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Google Apps Script nécessite que les données soient dans e.parameter
    // On envoie en multipart/form-data avec le champ "data"
    const formData = new FormData();
    formData.append('data', JSON.stringify(body));

    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData,
      redirect: 'follow',
    });

    const text = await res.text();
    console.log('[API/submit] Script response:', text);
    
    try {
      const json = JSON.parse(text);
      return NextResponse.json(json);
    } catch {
      return NextResponse.json({ success: true, raw: text });
    }
  } catch (err) {
    console.error('[API/submit] Erreur:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
