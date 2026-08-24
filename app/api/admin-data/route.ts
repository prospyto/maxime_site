import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

  const table = type === 'Reservations' ? 'reservations' : 'commandes';

  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
