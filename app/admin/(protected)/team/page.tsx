"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { Plus, Edit2, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface TeamMember {
  id: string
  name: string
  position: string
  image_url?: string
}

export default function AdminTeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("team_members").select("*").order("order_index", { ascending: true })

      if (error) throw error
      setTeamMembers(data || [])
    } catch (error) {
      console.error("Error fetching team members:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("team_members").delete().eq("id", id)

      if (error) throw error
      setTeamMembers(teamMembers.filter((m) => m.id !== id))
    } catch (error) {
      console.error("Error deleting team member:", error)
      alert("Failed to delete team member")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Team</h1>
            <p className="text-foreground/60">Add or update team member profiles</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/admin/team/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : teamMembers.length > 0 ? (
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={member.image_url || "/placeholder.svg?height=80&width=80&query=portrait"}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{member.name}</h3>
                  <p className="text-sm text-foreground/60">{member.position}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/team/${member.id}/edit`}>
                      <Edit2 className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(member.id)}
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
            <p className="text-foreground/60 mb-4">No team members yet</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/admin/team/new">Add First Member</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
