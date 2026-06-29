"use client"

import type React from "react"
import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

export default function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "Construction",
    bio: "",
    image_url: "",
    email: "",
    phone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("team_members")
          .select("*")
          .eq("id", id)
          .single()

        if (error) throw error
        if (data) {
          setFormData({
            name: data.name || "",
            position: data.position || "",
            department: data.department || "Construction",
            bio: data.bio || "",
            image_url: data.image_url || "",
            email: data.email || "",
            phone: data.phone || "",
          })
        }
      } catch (error) {
        console.error("Error fetching team member:", error)
        setError("Failed to load team member data.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMember()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from("team_members")
        .update({
          name: formData.name,
          position: formData.position,
          department: formData.department,
          bio: formData.bio,
          image_url: formData.image_url,
          email: formData.email,
          phone: formData.phone,
        })
        .eq("id", id)

      if (updateError) throw updateError

      router.push("/admin/team")
      router.refresh()
    } catch (error: any) {
      console.error("Error updating team member:", error)
      setError(error.message || "Failed to update team member.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground font-medium">Loading team member data...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/admin/team" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground font-heading">Edit Team Member</h1>
            <p className="text-foreground/60 mt-1">Update team member details</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Position *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Planning & Scheduling">Planning & Scheduling</option>
                <option value="Design Wing">Design Wing</option>
                <option value="Construction">Construction</option>
                <option value="Estimation">Estimation</option>
                <option value="Procurement">Procurement</option>
                <option value="Account">Account</option>
                <option value="Store">Store</option>
                <option value="Office">Office</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Team member biography"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Image</label>
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => setFormData((prev) => ({ ...prev, image_url: url }))}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-4 pt-6 border-t border-border">
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white font-bold">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button asChild variant="outline" className="border-border text-foreground hover:bg-muted">
              <Link href="/admin/team">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
