import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, payload } = body;

    if (type !== 'Reservations' && type !== 'Commandes') {
      return NextResponse.json({ success: false, error: 'Type invalide' }, { status: 400 });
    }

    const table = type === 'Reservations' ? 'reservations' : 'commandes';

    const { data, error } = await supabase.from(table).insert([payload]).select();

    if (error) {
      console.error('[API/submit] Erreur Supabase:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('[API/submit] Erreur:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
