import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './lib/auth'

// Protected routes that require authentication
const protectedRoutes = ['/(main)', '/api/transaction', '/api/products', '/api/analytics', '/api/customers', '/pos', '/dashboard', '/inventory', '/reports', '/settings']
const publicRoutes = ['/login', '/api/login']

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Exclude static files and Next.js internals
    if (path.startsWith('/_next') || path.includes('.')) {
        return NextResponse.next()
    }

    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
    const isPublicRoute = publicRoutes.includes(path)

    // Decrypt the session from the cookie
    const session = await getSession()

    // Redirect to login if user is not authenticated and trying to access a protected route
    if (isProtectedRoute && !session?.id) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }

    // Redirect to pos/dashboard if user is already authenticated and trying to access login
    if (isPublicRoute && session?.id) {
        return NextResponse.redirect(new URL('/pos', request.nextUrl))
    }

    return NextResponse.next()
}

// Config for matching paths
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
