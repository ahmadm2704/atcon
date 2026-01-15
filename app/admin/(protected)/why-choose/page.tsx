"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { Plus, Trash2, Edit } from "lucide-react"
import Link from "next/link"

interface Feature {
  id: string
  title: string
  description: string
  icon_name: string
  order_index?: number
}

export default function AdminWhyChoosePage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFeatures()
  }, [])

  const fetchFeatures = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("why_choose_us").select("*").order("order_index", { ascending: true })

      if (error) throw error
      setFeatures(data || [])
    } catch (error) {
      console.error("Error fetching features:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feature?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("why_choose_us").delete().eq("id", id)

      if (error) throw error
      setFeatures(features.filter((f) => f.id !== id))
    } catch (error) {
      console.error("Error deleting feature:", error)
      alert("Failed to delete feature")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Why Choose Us</h1>
            <p className="text-foreground/60">Manage your competitive advantages</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/admin/why-choose/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : features.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow relative group">
                <div className="mb-4">
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">Icon: {feature.icon_name}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-foreground/70">{feature.description}</p>

                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    asChild
                  >
                    <Link href={`/admin/why-choose/${feature.id}/edit`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(feature.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No features added yet</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/admin/why-choose/new">Add First Feature</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
