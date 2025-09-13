import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('Middleware triggered for:', request.nextUrl.pathname)
  
  // Check if the user is already on the admin login page
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }
  
  // Only protect other admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check for admin session/token
    const adminCookie = request.cookies.get('admin-auth')
    const adminPassword = adminCookie?.value
    
    console.log('Admin cookie found:', !!adminCookie)
    console.log('Cookie value:', adminPassword ? '[REDACTED]' : 'none')
   
    // Simple password-based authentication
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
    
    console.log('Password match:', adminPassword === ADMIN_PASSWORD)
   
    if (!adminPassword || adminPassword !== ADMIN_PASSWORD) {
      console.log('Redirecting to login page')
      // Redirect to admin login page
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    console.log('Authentication successful, proceeding to admin page')
  }
 
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}