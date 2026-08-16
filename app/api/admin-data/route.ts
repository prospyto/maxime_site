import { NextRequest, NextResponse } from 'next/server';

const SCRIPT_URL = process.env.GOOGLE_SHEET_SCRIPT_URL!;

export async function GET(req: NextRequest) {
  // Protection : seule une session admin valide peut lire les données
  const session = req.cookies.get('ember_admin');
  if (!session || session.value !== 'authenticated') {
    return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
  }

  const type = req.nextUrl.searchParams.get('type');
  if (type !== 'Reservations' && type !== 'Commandes') {
    return NextResponse.json({ success: false, error: 'Type invalide' }, { status: 400 });
  }

  try {
    const res = await fetch(`${SCRIPT_URL}?type=${type}`, {
      redirect: 'follow',
      cache: 'no-store',
    });
    const json = await res.json();
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
