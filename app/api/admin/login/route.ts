import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/admin/login
 * Simple admin authentication endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
   
    // Get admin password from environment variable
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
   
    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json({
        success: true,
        message: 'Authentication successful'
      })
     
      // Set cookie with proper settings for development and production
      response.cookies.set('admin-auth', password, {
        httpOnly: true, // Always true for security
        secure: process.env.NODE_ENV === 'production', // Only secure in production (HTTPS)
        sameSite: 'strict',
        maxAge: 86400, // 24 hours
        path: '/'
      })
     
      return response
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/login
 * Admin logout endpoint
 */
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  })
 
  // Clear the admin auth cookie
  response.cookies.delete('admin-auth')
 
  return response
}