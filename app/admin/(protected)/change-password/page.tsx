"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { KeyRound, ShieldAlert, CheckCircle2 } from "lucide-react"

export default function ChangePasswordPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Basic client validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password")
      }

      setSuccess("Your password has been changed successfully.")
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 2000)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Security Settings</h1>
            <p className="text-foreground/60">Update your admin credentials</p>
          </div>
          <Link href="/admin/dashboard" className="text-primary hover:text-primary/80">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-xl mx-auto p-6 mt-8">
        <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Change Admin Password</h2>
              <p className="text-xs text-muted-foreground">Ensure your account is using a secure, random password.</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900/50 rounded-lg text-sm flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-900/50 rounded-lg text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Current Password *
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                New Password *
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirm New Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Confirm your new password"
              />
            </div>

            <div className="flex gap-4 pt-4 border-t border-border">
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                {isSubmitting ? "Updating..." : "Update Password"}
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/dashboard">Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
