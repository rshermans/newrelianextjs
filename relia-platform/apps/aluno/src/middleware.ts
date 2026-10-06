import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const ROTAS_PUBLICAS = [
  '/',
  '/entrar',
  '/registar',
  '/termos',
  '/privacidade',
  '/contacto',
];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  // Permite recursos estáticos e rotas de autenticação
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isPublica = ROTAS_PUBLICAS.some(
    (rota) => pathname === rota || pathname.startsWith(`${rota}/`)
  );

  // Redireciona para /entrar se rota privada e não autenticado
  if (!isLoggedIn && !isPublica) {
    const redirectUrl = new URL('/entrar', nextUrl.origin);
    redirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Guarda administrativa para /admin/*
  if (pathname.startsWith('/admin')) {
    const isAdmin = (req.auth?.user as { isAdmin?: boolean })?.isAdmin;
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
