"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Project {
  id: string
  title: string
  short_description: string
  image_url: string
  category?: string
  year?: number
  order_index?: number
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("projects").select("*").order("order_index", { ascending: true })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("projects").delete().eq("id", id)

      if (error) throw error
      setProjects(projects.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Error deleting project:", error)
      alert("Failed to delete project")
    }
  }

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projects.length - 1) return;

    const newProjects = [...projects];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const itemA = newProjects[index];
    const itemB = newProjects[swapIndex];

    const orderA = itemA.order_index ?? index;
    const orderB = itemB.order_index ?? swapIndex;

    itemA.order_index = orderB;
    itemB.order_index = orderA;

    [newProjects[index], newProjects[swapIndex]] = [itemB, itemA];
    setProjects(newProjects);

    try {
      const supabase = createClient();
      await supabase.from("projects").update({ order_index: orderB }).eq("id", itemA.id);
      await supabase.from("projects").update({ order_index: orderA }).eq("id", itemB.id);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Projects</h1>
            <p className="text-foreground/60">Add, edit, or remove projects from your portfolio</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/admin/projects/new">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={project.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
                {/* Reorder Handles */}
                <div className="flex flex-col gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    disabled={index === projects.length - 1}
                    onClick={() => handleMove(index, 'down')}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                </div>

                {/* Thumbnail */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={project.image_url || "/placeholder.svg?height=100&width=100"}
                    alt={project.title}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{project.title}</h3>
                  <p className="text-sm text-foreground/60 line-clamp-1">{project.short_description}</p>
                  <div className="flex gap-2 mt-2">
                    {project.category && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{project.category}</span>
                    )}
                    {project.year && <span className="text-xs text-foreground/60">{project.year}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      <Edit2 className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-foreground/60 mb-4">No projects yet</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/admin/projects/new">Create First Project</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
