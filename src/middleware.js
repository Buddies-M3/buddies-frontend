import { NextResponse } from "next/server";
import { backloop } from "utils/constants";
import { UID, USER_TOKEN } from "utils/cookies-utils";

// Array of paths to exclude from middleware
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
  '/favicon.ico'
]; 

export async function middleware(request) {
  /* const currentPath = request.nextUrl.pathname;
  
  // If the path matches any of the excluded paths, skip the middleware
  if (excludedPaths.some(path => currentPath.startsWith(path))) {
    return NextResponse.next(); // Allow the request to continue without further checks
  }

  const protocol = backloop.protocol || request.headers.get('x-forwarded-proto') || 'https';
  const domain = request.headers.get('host');

  const uid = request.cookies.get(UID);
  const token = request.cookies.get(USER_TOKEN);

  // If either UID or token is missing, redirect to login
  if (!uid || !token) {
    return NextResponse.redirect(`${protocol}://${domain}/api-keys/login`);
  }

  const formData = new FormData();
  formData.append("token", token.value);

  try {
    const verifyResponse = await fetch(`http://localhost:3001/api-keys/login/api/verify`, {
      method: 'POST',
      body: formData
    });

    if (verifyResponse.ok) {
      const data = await verifyResponse.json();
      if (data.status !== 'success') {
        console.log("Login verification failed");
        return NextResponse.redirect(`${protocol}://${domain}/api-keys/login`);
      }
    } else if (verifyResponse.status === 401) {
      const data = await verifyResponse.json();
      if (data.status === 'not_verified') {
        return NextResponse.redirect(`${protocol}://${domain}/api-keys/verify-email/${data.email}`);
      } else {
        console.error('Login failed with status:', verifyResponse.statusText);
        // Handle other cases where login fails but shouldn't loop redirects
        return NextResponse.redirect(`${protocol}://${domain}/api-keys/login`);
      }
    } else {
      console.error('Unexpected response status:', verifyResponse.status);
      // Avoid infinite redirects on unexpected errors
      return NextResponse.redirect(`${protocol}://${domain}/api-keys/login`);
    }
  } catch (error) {
    console.error('Error during verification:', error);
    // Avoid redirect loops on fetch failure
    return NextResponse.redirect(`${protocol}://${domain}/api-keys/login`);
  }
 */
  // Allow the request to proceed if everything is okay
  return NextResponse.next();
}