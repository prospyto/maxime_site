import { NextRequest, NextResponse } from 'next/server';

// URL secrète — ne pas partager
const SECRET_ADMIN_PATH = '/admin-e9x7k2mq';

// Toutes les routes qui commencent par /admin (sauf l'URL secrète) → 404
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Si quelqu'un tente /admin ou /admin/... → 404 immédiat, pas de redirect
  if (pathname.startsWith('/admin') && !pathname.startsWith(SECRET_ADMIN_PATH)) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/admin-:path*'],
};
