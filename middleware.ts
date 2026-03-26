import { type NextRequest, NextResponse } from 'next/server';

/**
 * Middleware handles one simple case server-side:
 * if the user navigates to /login while already having a Supabase session cookie,
 * redirect them home.
 *
 * Full auth protection (unauthenticated → /login) is handled client-side in
 * components/app-layout.tsx because @supabase/supabase-js uses localStorage,
 * not HTTP cookies, so server-side session reads aren't available without
 * @supabase/ssr.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Detect any Supabase auth cookie (sb-*-auth-token)
  const hasSession = [...request.cookies.getAll()].some(
    (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  );

  // Already logged in → don't show /login or /signup
  if (hasSession && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon|api|.*\\..*).*)'],
};
