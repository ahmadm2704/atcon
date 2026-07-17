"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { Plus, Edit2, Trash2, GripVertical, ChevronUp, ChevronDown, Loader2, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface TeamMember {
  id: string
  name: string
  position: string
  department?: string
  image_url?: string
  order_index: number
}

const DEPARTMENTS = [
  "Planning & Scheduling",
  "Design Wing",
  "Media",
  "Construction",
  "Estimation",
  "Procurement",
  "Account",
  "Store",
  "Office"
]

export default function AdminTeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [selectedDept, setSelectedDept] = useState<string>("All")

  // Drag and drop states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null)

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("order_index", { ascending: true })

      if (error) throw error
      setTeamMembers(data || [])
    } catch (error) {
      console.error("Error fetching team members:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateDatabaseOrder = async (newOrder: TeamMember[]) => {
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      const supabase = createClient()
      
      // Perform sequential updates to ensure order_index is set correctly
      const promises = newOrder.map((member, index) => 
        supabase
          .from("team_members")
          .update({ order_index: index })
          .eq("id", member.id)
      )
      
      const results = await Promise.all(promises)
      const firstError = results.find(r => r.error)
      if (firstError?.error) throw firstError.error

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (error) {
      console.error("Error saving new order:", error)
      alert("Failed to save new order in database.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === teamMembers.length - 1) return

    const targetIndex = direction === "up" ? index - 1 : index + 1
    const updated = [...teamMembers]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp

    setTeamMembers(updated)
    await updateDatabaseOrder(updated)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("team_members").delete().eq("id", id)

      if (error) throw error
      const filtered = teamMembers.filter((m) => m.id !== id)
      setTeamMembers(filtered)
      
      // Re-index remaining members to maintain clean ordering
      await updateDatabaseOrder(filtered)
    } catch (error) {
      console.error("Error deleting team member:", error)
      alert("Failed to delete team member")
    }
  }

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
    // Set placeholder image / styling for dragging if desired
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === index) return
    setDraggedOverIndex(index)
  }

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null)
      setDraggedOverIndex(null)
      return
    }

    const updated = [...teamMembers]
    const [movedItem] = updated.splice(draggedIndex, 1)
    updated.splice(targetIndex, 0, movedItem)

    setTeamMembers(updated)
    setDraggedIndex(null)
    setDraggedOverIndex(null)
    
    await updateDatabaseOrder(updated)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-foreground font-heading">Manage Team</h1>
              <div className="flex items-center gap-2 h-8">
                {isSaving && (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    Saving order...
                  </span>
                )}
                {saveSuccess && (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full">
                    <Check className="w-3.5 h-3.5" />
                    Order saved
                  </span>
                )}
              </div>
            </div>
            <p className="text-foreground/60 mt-1">Add, update or drag-and-drop to reorder team member profiles</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold">
            <Link href="/admin/team/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Department Filter Tabs */}
        {!isLoading && teamMembers.length > 0 && (
          <div className="flex flex-wrap gap-2 max-w-5xl">
            {["All", ...DEPARTMENTS].map((dept) => {
              const count = dept === "All" 
                ? teamMembers.length 
                : teamMembers.filter(m => m.department === dept).length;
              
              if (count === 0 && dept !== "All") return null;

              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-4 py-2 rounded-full text-xs font-bold font-heading tracking-wide uppercase transition-all duration-300 cursor-pointer border ${
                    selectedDept === dept
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-muted/30 text-foreground/75 border-border/50 hover:bg-muted/60"
                  }`}
                >
                  {dept} <span className="text-[10px] ml-1 opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Warning Banner when filtering is active */}
        {selectedDept !== "All" && (
          <div className="text-sm text-muted-foreground bg-muted/20 border border-border/40 p-3 rounded-lg flex items-center gap-2">
            <span>ℹ️</span>
            <span>Reordering is disabled while filtering by department. Select <strong>"All"</strong> to enable drag-and-drop ordering.</span>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : teamMembers.length > 0 ? (
          <div className="space-y-3">
            {teamMembers
              .filter(m => selectedDept === "All" || m.department === selectedDept)
              .map((member, index) => {
                const isDragging = draggedIndex === index
                const isOver = draggedOverIndex === index
                const isSortingEnabled = selectedDept === "All"
                
                return (
                  <div
                    key={member.id}
                    draggable={isSortingEnabled && !isSaving}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`bg-card border rounded-lg p-4 flex items-center gap-4 transition-all duration-200 select-none ${
                      isDragging ? "opacity-40 scale-[0.98] border-dashed border-primary" : "border-border"
                    } ${
                      isOver ? "border-t-4 border-t-primary pt-6 bg-muted/30" : ""
                    } hover:shadow-md`}
                  >
                    {/* Grip & Arrows */}
                    <div className="flex items-center gap-2">
                      {/* Desktop Grip */}
                      {isSortingEnabled && (
                        <div 
                          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded text-muted-foreground transition-colors hidden md:block"
                          title="Drag to reorder"
                        >
                          <GripVertical className="w-5 h-5" />
                        </div>
                      )}
  
                      {/* Up/Down Arrows */}
                      <div className="flex flex-col gap-0.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30"
                          disabled={!isSortingEnabled || index === 0 || isSaving}
                          onClick={() => handleMove(index, "up")}
                          title="Move Up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30"
                          disabled={!isSortingEnabled || index === teamMembers.length - 1 || isSaving}
                          onClick={() => handleMove(index, "down")}
                          title="Move Down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 relative">
                    <Image
                      src={member.image_url || "/placeholder.svg?height=80&width=80&query=portrait"}
                      alt={member.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                      priority={index < 4}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground truncate">{member.name}</h3>
                    <div className="flex flex-wrap gap-2 items-center mt-1">
                      <span className="text-sm text-foreground/60 truncate">{member.position}</span>
                      {member.department && (
                        <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">
                          {member.department}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="h-9 border-border text-foreground hover:bg-muted">
                      <Link href={`/admin/team/${member.id}/edit`}>
                        <Edit2 className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                      className="h-9 border-border text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-foreground/60 mb-4 font-medium">No team members yet</p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold">
              <Link href="/admin/team/new">Add First Member</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
