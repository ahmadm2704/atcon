"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { Plus, Trash2 } from "lucide-react"
import Link from "next/link"

interface Testimonial {
  id: string
  client_name: string
  client_company?: string
  content: string
  rating?: number
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("testimonials").select("*").order("order_index", { ascending: true })

      if (error) throw error
      setTestimonials(data || [])
    } catch (error) {
      console.error("Error fetching testimonials:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("testimonials").delete().eq("id", id)

      if (error) throw error
      setTestimonials(testimonials.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Error deleting testimonial:", error)
      alert("Failed to delete testimonial")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Testimonials</h1>
            <p className="text-foreground/60">Manage client testimonials</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/admin/testimonials/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-foreground">{testimonial.client_name}</h3>
                      {testimonial.rating && (
                        <span className="text-primary text-sm">{"⭐".repeat(testimonial.rating)}</span>
                      )}
                    </div>
                    {testimonial.client_company && (
                      <p className="text-sm text-foreground/60 mb-2">{testimonial.client_company}</p>
                    )}
                    <p className="text-foreground/70 line-clamp-2">{testimonial.content}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(testimonial.id)}
                    className="text-red-600 hover:text-red-700 ml-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-foreground/60 mb-4">No testimonials yet</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/admin/testimonials/new">Add First Testimonial</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
