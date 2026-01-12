"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function EditWhyChoosePage() {
  const router = useRouter()
  const params = useParams()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkAuth = () => {
      const adminEmail = localStorage.getItem("adminEmail")
      if (!adminEmail) {
        router.push("/admin/login")
        return
      }
      fetchContent()
    }

    checkAuth()
  }, [router])

  const fetchContent = async () => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const { data, error: fetchError } = await supabase.from("why_choose").select("*").eq("id", params.id).single()

      if (fetchError && fetchError.code !== "PGRST116") throw fetchError

      if (data) {
        setFormData({ title: data.title, description: data.description })
      }
    } catch (err) {
      setError("Failed to fetch content")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const { error: updateError } = await supabase
        .from("why_choose")
        .update({ title: formData.title, description: formData.description })
        .eq("id", params.id)

      if (updateError) throw updateError

      router.push("/admin/why-choose")
    } catch (err) {
      setError("Failed to save content")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/admin/why-choose" className="flex items-center gap-2 text-primary hover:underline mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Why Choose
      </Link>

      <h1 className="text-3xl font-bold mb-8">Edit "Why Choose ATCON" Content</h1>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
            placeholder="Section title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={8}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
            placeholder="Enter the why choose content..."
          />
          <p className="text-sm text-foreground/60 mt-2">Character count: {formData.description.length}</p>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving} className="bg-primary text-white">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Link href="/admin/why-choose">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
