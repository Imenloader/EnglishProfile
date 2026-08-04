import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Exclude auth routes from protection to prevent infinite loops
  if (pathname.startsWith('/api/auth') || pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Determine if this is a protected route
  const isAdminPage = pathname.startsWith('/admin');
  const isProtectedApi = 
    (pathname === '/api/settings' && request.method === 'POST') ||
    (pathname === '/api/questions' && (request.method === 'POST' || request.method === 'DELETE')) ||
    (pathname === '/api/leads' && searchParams.get('include_answers') === 'true');

  if (isAdminPage || isProtectedApi) {
    const adminToken = request.cookies.get('admin_token');

    if (!adminToken || adminToken.value !== 'authenticated') {
      if (isAdminPage) {
        // Redirect to login page
        return NextResponse.redirect(new URL('/admin/login', request.url));
      } else {
        // Return 401 for API requests
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
