"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { TeamMemberCard } from "@/components/team-member-card"
import { createClient } from "@/lib/supabase"

interface TeamMember {
  id: string
  name: string
  position: string
  bio?: string
  image_url?: string
  email?: string
  phone?: string
  social_links?: Record<string, string>
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
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

    fetchTeamMembers()
  }, [])

  return (
    <main>
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 pt-32 pb-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Our Team</h1>
          <p className="text-lg text-foreground/70 max-w-2xl">
            Meet the talented professionals behind ATCON's innovative architecture and development projects.
          </p>
        </div>
      </div>

      {/* Team Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-72 bg-muted rounded-lg animate-pulse mb-4" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
              </div>
            ))}
          </div>
        ) : teamMembers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <TeamMemberCard
                key={member.id}
                id={member.id}
                name={member.name}
                position={member.position}
                bio={member.bio}
                imageUrl={member.image_url}
                email={member.email}
                phone={member.phone}
                socialLinks={member.social_links}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-foreground/50">No team members found yet.</p>
          </div>
        )}
      </div>

      {/* Culture Section */}
      <div className="bg-muted/50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Our Culture</h2>
          <p className="text-lg text-foreground/70 mb-8">
            We believe in fostering a collaborative environment where innovation thrives, creativity flourishes, and
            every team member contributes to shaping tomorrow's architecture. Our commitment to excellence and
            sustainable design drives everything we do.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  )
}
