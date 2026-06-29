"use client"

import type React from "react"
import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchService = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("id", id)
          .single()

        if (error) throw error
        if (data) {
          setFormData({
            title: data.title || "",
            description: data.description || "",
          })
        }
      } catch (error) {
        console.error("Error fetching service:", error)
        setError("Failed to load service data.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchService()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        .from("services")
        .update({
          title: formData.title,
          description: formData.description,
        })
        .eq("id", id)

      if (updateError) throw updateError

      router.push("/admin/services")
      router.refresh()
    } catch (error: any) {
      console.error("Error updating service:", error)
      setError(error.message || "Failed to update service.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground font-medium">Loading service data...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/admin/services" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground font-heading">Edit Service</h1>
            <p className="text-foreground/60 mt-1">Update service details</p>
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

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex gap-4 pt-6 border-t border-border">
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white font-bold">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button asChild variant="outline" className="border-border text-foreground hover:bg-muted">
              <Link href="/admin/services">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
