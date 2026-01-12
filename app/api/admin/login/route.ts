import { createAdminClient } from "@/lib/supabase-admin"
import { hashPassword } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Get admin user from Supabase
    const supabase = createAdminClient()
    const { data: user, error } = await supabase.from("admin_users").select("*").eq("email", email).single()

    if (error || !user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const passwordHash = hashPassword(password)
    if (user.password_hash !== passwordHash) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Create response with token
    const response = NextResponse.json(
      { message: "Login successful", user: { id: user.id, email: user.email, name: user.name } },
      { status: 200 },
    )

    // Set token cookie
    response.cookies.set("adminToken", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
