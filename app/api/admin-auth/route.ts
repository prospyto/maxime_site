import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Diagnostic sans divulguer la valeur : confirme si la variable
  // ADMIN_PASSWORD est bien reçue par le serveur en production.
  const pw = process.env.ADMIN_PASSWORD;
  return NextResponse.json({
    variableDefinie: typeof pw === 'string' && pw.length > 0,
    longueur: pw ? pw.length : 0,
  });
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin';

  if (password === expectedPassword) {
    const res = NextResponse.json({ success: true });
    // Cookie de session valable 8h
    res.cookies.set('ember_admin', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8,
      path: '/',
      sameSite: 'strict',
    });
    return res;
  }

  return NextResponse.json({ success: false, error: 'Mot de passe incorrect' }, { status: 401 });
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete('ember_admin');
  return res;
}
