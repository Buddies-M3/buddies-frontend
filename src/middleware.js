import { NextResponse } from "next/server";
import { backloop } from "utils/constants";
import { UID, USER_TOKEN } from "utils/cookies-utils";

// Array of paths to exclude from middleware (public paths)
const excludedPaths = [
  '/login',
  '/api-keys/login',
  '/register', 
  '/api-keys/register', 
  '/verify-email', 
  '/api-keys/verify-email', 
  '/reset-password',
  '/api-keys/reset-password',
  '/logout',
  '/api-keys/logout',
  '/_next',
  '/api-keys/_next',
  '/favicon.ico',
  '/privacy',
  '/billing',
  '/create'
]; 

export async function middleware(request) {
  const currentPath = request.nextUrl.pathname;
  
  console.log('Middleware running for path:', currentPath);
  
  // Allow root path without authentication
  if (currentPath === '/') {
    console.log('Root path, allowing access');
    return NextResponse.next();
  }

  // If the path matches any of the excluded paths, skip the middleware
  if (excludedPaths.some(path => currentPath === path || currentPath.startsWith(path + '/'))) {
    console.log('Path excluded from auth:', currentPath);
    return NextResponse.next(); // Allow the request to continue without further checks
  }

  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  const domain = request.headers.get('host');

  const uid = request.cookies.get(UID);
  const token = request.cookies.get(USER_TOKEN);

  console.log('Checking auth cookies - UID:', !!uid, 'Token:', !!token);

  // If either UID or token is missing, redirect to login
  if (!uid || !token) {
    console.log('Missing auth cookies, redirecting to login');
    return NextResponse.redirect(`${protocol}://${domain}/login`);
  }

  // Check if authentication cookies exist and have valid format
  if (token.value && uid.value && token.value.length > 10 && uid.value.startsWith('user_')) {
    console.log('Auth valid, allowing access');
    return NextResponse.next(); // Allow access if cookies are present and valid
  } else {
    console.log('Invalid auth tokens, redirecting to login');
    // Invalid or missing authentication, redirect to login
    return NextResponse.redirect(`${protocol}://${domain}/login`);
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (static assets)
     * - images (image files)
     * - svg (svg files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|images|svg).*)',
  ],
}