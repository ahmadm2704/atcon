"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import Link from "next/link"

export default function NewTestimonialPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    client_name: "",
    client_company: "",
    content: "",
    rating: 5,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("testimonials").insert([
        {
          ...formData,
          order_index: 0,
          featured: false,
        },
      ])

      if (error) throw error
      router.push("/admin/testimonials")
    } catch (error) {
      console.error("Error creating testimonial:", error)
      alert("Failed to create testimonial")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin/testimonials" className="text-primary hover:text-primary/80 mb-4 inline-block">
            ← Back to Testimonials
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Add Testimonial</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Client Name *</label>
              <input
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Company</label>
              <input
                type="text"
                name="client_company"
                value={formData.client_company}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <option key={i} value={i}>
                  {i} Stars
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Testimonial *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="What the client said..."
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
              {isSubmitting ? "Adding..." : "Add Testimonial"}
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/testimonials">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
