import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, decodeAuthPayload } from '@/lib/auth';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow portal login and signup pages without auth
  if (pathname === '/portal/login' || pathname === '/portal/signup') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/portal')) {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL('/portal/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const user = decodeAuthPayload(token);

    if (!user) {
      const loginUrl = new URL('/portal/login', req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Admin routes require SUPER_ADMIN role
    if (pathname.startsWith('/portal/admin') && user.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(
        new URL('/portal/pharmacist/dashboard', req.url)
      );
    }

    // Pharmacist routes require PHARMACIST role
    if (
      pathname.startsWith('/portal/pharmacist') &&
      user.role !== 'PHARMACIST'
    ) {
      return NextResponse.redirect(
        new URL('/portal/admin/dashboard', req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*'],
};
