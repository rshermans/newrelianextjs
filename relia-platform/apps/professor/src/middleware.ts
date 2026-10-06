import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const ROTAS_PUBLICAS = ['/entrar'];

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

  if (!isLoggedIn && !isPublica) {
    const redirectUrl = new URL('/entrar', nextUrl.origin);
    redirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Verifica se tem permissão docente ou administrativa
  if (isLoggedIn && !isPublica) {
    const user = req.auth?.user as { isProfessor?: boolean; isAdmin?: boolean } | undefined;
    const temPermissao = user?.isProfessor || user?.isAdmin;
    if (!temPermissao) {
      return NextResponse.redirect(new URL('/entrar?erro=nao_autorizado', nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
