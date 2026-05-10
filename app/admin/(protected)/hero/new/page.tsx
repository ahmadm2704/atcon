"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

export default function NewHeroSlidePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title1: "",
    title2: "",
    description: "",
    image_url: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!formData.image_url) {
      setError("Please upload an image for the slide.")
      setIsSubmitting(false)
      return
    }

    try {
      const supabase = createClient()

      // get current max order_index
      const { data: currentSlides, error: fetchError } = await supabase
        .from("hero_slides")
        .select("order_index")
        .order("order_index", { ascending: false })
        .limit(1)

      if (fetchError) throw fetchError

      const newOrderIndex = currentSlides && currentSlides.length > 0 ? currentSlides[0].order_index + 1 : 0;

      const { error: insertError } = await supabase.from("hero_slides").insert([
        {
          title1: formData.title1,
          title2: formData.title2,
          description: formData.description,
          image_url: formData.image_url,
          order_index: newOrderIndex
        },
      ])

      if (insertError) throw insertError

      router.push("/admin/hero")
      router.refresh()
    } catch (error: any) {
      console.error("Error creating slide:", error)
      setError(error.message || "Failed to create slide.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (url: string) => {
    setFormData((prev) => ({ ...prev, image_url: url }))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/hero" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Add New Slide</h1>
          <p className="text-muted-foreground mt-1">Create a new image slide for the hero section.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-sm border border-border p-6 md:p-8 space-y-8">
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title Part 1 (Highlight Color) (Optional)</label>
              <input
                type="text"
                name="title1"
                value={formData.title1}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                placeholder="e.g. SMART"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title Part 2 (White Color) (Optional)</label>
              <input
                type="text"
                name="title2"
                value={formData.title2}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
                placeholder="e.g. DESIGNS"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description (Optional)</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none text-foreground"
              placeholder="Short description text to display below the title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Background Image</label>
            <ImageUpload 
              value={formData.image_url} 
              onChange={handleImageChange} 
            />
            <p className="text-xs text-muted-foreground mt-1">Recommended size: 1920x1080px or similar wide aspect ratio.</p>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-border">
          <Link href="/admin/hero">
            <Button type="button" variant="outline" className="border-border text-foreground hover:bg-muted">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="font-bold bg-primary hover:bg-primary/90 text-white">
            {isSubmitting ? "Saving..." : "Save Slide"}
          </Button>
        </div>
      </form>
    </div>
  )
}
