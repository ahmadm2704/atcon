import { createAdminClient } from "@/lib/supabase-admin"
import { hashPassword } from "@/lib/auth"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current password and new password are required" },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const adminToken = cookieStore.get("adminToken")?.value

    if (!adminToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const supabase = createAdminClient()

    // Fetch the admin user by ID (stored in adminToken cookie)
    const { data: user, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", adminToken)
      .single()

    if (error || !user) {
      return NextResponse.json({ message: "Admin user not found" }, { status: 404 })
    }

    // Verify current password hash
    const currentHash = hashPassword(currentPassword)
    if (user.password_hash !== currentHash) {
      return NextResponse.json(
        { message: "Incorrect current password" },
        { status: 400 }
      )
    }

    // Hash and update to new password
    const newHash = hashPassword(newPassword)
    const { error: updateError } = await supabase
      .from("admin_users")
      .update({ 
        password_hash: newHash,
        updated_at: new Date().toISOString()
      })
      .eq("id", adminToken)

    if (updateError) {
      console.error("Error updating password in Supabase:", updateError)
      return NextResponse.json(
        { message: "Failed to update password in database" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Change password API error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
