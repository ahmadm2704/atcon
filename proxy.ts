import { type NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = request.cookies.get("adminToken")?.value

    // Allow access to login page without token
    if (request.nextUrl.pathname === "/admin/login") {
      if (token) {
        // If already logged in, redirect to dashboard
        return NextResponse.redirect(new URL("/admin/dashboard", request.url))
      }
      return NextResponse.next()
    }

    // Require token for other admin pages
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
