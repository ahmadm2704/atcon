"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react"

interface HeroSlide {
  id: string
  title1: string
  title2: string
  description: string
  image_url: string
  order_index: number
}

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const fetchSlides = async () => {
    try {
      setErrorMsg(null)
      const supabase = createClient()
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .order("order_index", { ascending: true })

      if (error) throw error
      setSlides(data || [])
    } catch (error: any) {
      console.error("Error fetching slides:", error)
      setErrorMsg(error.message || "Failed to fetch slides. Did you run the SQL setup script?")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSlides()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("hero_slides").delete().eq("id", id)

      if (error) throw error
      setSlides(slides.filter((slide) => slide.id !== id))
    } catch (error) {
      console.error("Error deleting slide:", error)
      alert("Failed to delete slide.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Hero Section</h1>
          <p className="text-muted-foreground mt-1">Manage the image slider on the home page.</p>
        </div>
        <Link href="/admin/hero/new">
          <Button className="gap-2 font-bold bg-primary hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4" />
            Add Slide
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Image</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Description</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    Loading slides...
                  </td>
                </tr>
              ) : errorMsg ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-destructive bg-destructive/10">
                    <p className="font-bold">Error loading slides:</p>
                    <p>{errorMsg}</p>
                    <p className="mt-2 text-sm text-foreground">Please make sure you have run the updated <code>supabase_setup.sql</code> in your Supabase SQL Editor to create the <code>hero_slides</code> table.</p>
                  </td>
                </tr>
              ) : slides.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No slides found. Click "Add Slide" to create one.
                  </td>
                </tr>
              ) : (
                slides.map((slide) => (
                  <tr key={slide.id} className="hover:bg-muted/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="relative w-24 h-16 rounded overflow-hidden">
                        <Image
                          src={slide.image_url || "/placeholder.svg"}
                          alt={slide.title1}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        <span className="text-primary">{slide.title1}</span> {slide.title2}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate text-muted-foreground">
                      {slide.description}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/hero/${slide.id}/edit`}>
                          <Button variant="outline" size="sm" className="h-8 border-border hover:bg-muted text-foreground">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8"
                          onClick={() => handleDelete(slide.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
