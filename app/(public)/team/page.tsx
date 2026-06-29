"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/page-header"
import { TeamMemberCard } from "@/components/team-member-card"
import { createClient } from "@/lib/supabase"

interface TeamMember {
  id: string
  name: string
  position: string
  department?: string
  bio?: string
  image_url?: string
  email?: string
  phone?: string
  social_links?: Record<string, string>
}

const DEPARTMENTS = [
  "Planning & Scheduling",
  "Design Wing",
  "Construction",
  "Estimation",
  "Procurement",
  "Account",
  "Store",
  "Office"
]

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDept, setSelectedDept] = useState<string>("All")

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

  // Filter CEO/Founder
  const executives = teamMembers.filter(m =>
    m.position.toLowerCase().includes("ceo") ||
    m.position.toLowerCase().includes("founder") ||
    m.position.toLowerCase().includes("director")
  );
  const otherMembers = teamMembers.filter(m =>
    !m.position.toLowerCase().includes("ceo") &&
    !m.position.toLowerCase().includes("founder") &&
    !m.position.toLowerCase().includes("director")
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="Our Team"
        description="Meet the visionaries and experts driving innovation at ATCON."
        backgroundImage="/hero1.jpg"
      />

      {/* CEO / Leadership Message Section */}
      {!isLoading && executives.length > 0 && (
        <section className="py-20 bg-muted/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent skew-x-12" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {executives.map((exec, idx) => (
              <motion.div
                key={exec.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col lg:flex-row items-center gap-12 ${idx > 0 ? "mt-24" : ""}`}
              >
                {/* Image Side */}
                <div className="w-full lg:w-1/3 relative group">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden relative shadow-2xl border-4 border-background">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-all duration-500" />
                    <img
                      src={exec.image_url || "/placeholder-user.jpg"}
                      alt={exec.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  {/* Floating Name Card */}
                  <div className="absolute -bottom-6 -right-6 bg-card border border-border p-6 rounded-xl shadow-xl max-w-[200px]">
                    <h3 className="text-xl font-bold text-foreground">{exec.name}</h3>
                    <p className="text-primary font-medium text-sm">{exec.position}</p>
                  </div>
                </div>

                {/* Message Side */}
                <div className="w-full lg:w-2/3">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-primary font-semibold tracking-wider uppercase text-sm">Leadership Message</span>
                    <h2 className="text-4xl font-bold text-foreground mt-2 mb-8 leading-tight">
                      Leading with <span className="text-primary">Vision</span> & Integrity
                    </h2>
                    <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                      {exec.bio?.split('\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      )) || <p>No message available.</p>}
                    </div>
                    <div className="mt-8 pt-8 border-t border-border">
                      <img src="/logo.png" alt="Signature" className="h-12 opacity-50 dark:invert" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Team Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground">Our Dedicated Team</h2>
          <div className="w-20 h-1 bg-primary mx-auto mt-4" />
        </div>

        {/* Department Filter Tabs */}
        {!isLoading && otherMembers.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-16 max-w-5xl mx-auto">
            {["All", ...DEPARTMENTS].map((dept) => {
              const count = dept === "All" 
                ? otherMembers.length 
                : otherMembers.filter(m => m.department === dept).length;
              
              if (count === 0 && dept !== "All") return null;

              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold font-heading tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    selectedDept === dept
                      ? "bg-primary text-white shadow-lg shadow-red-900/20 scale-105"
                      : "bg-muted/30 text-foreground/75 border border-border/50 hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  {dept} <span className={`text-[10px] ml-1 opacity-70 ${selectedDept === dept ? "text-white/80" : "text-muted-foreground"}`}>({count})</span>
                </button>
              );
            })}
          </div>
        )}

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
        ) : otherMembers.length > 0 ? (
          <div className="space-y-16">
            {DEPARTMENTS
              .filter((dept) => selectedDept === "All" || selectedDept === dept)
              .map((dept) => {
                const deptMembers = otherMembers.filter(m => m.department === dept)
                if (deptMembers.length === 0) return null

                return (
                  <div key={dept} className="space-y-8">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-bold text-foreground tracking-widest font-heading uppercase text-primary">
                        {dept}
                      </h3>
                      <div className="flex-1 h-[1px] bg-border/40" />
                    </div>

                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-100px" }}
                      className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                      {deptMembers.map((member) => (
                        <motion.div key={member.id} variants={itemVariants}>
                          <TeamMemberCard
                            id={member.id}
                            name={member.name}
                            position={member.position}
                            bio={member.bio}
                            imageUrl={member.image_url}
                            email={member.email}
                            phone={member.phone}
                            socialLinks={member.social_links}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                )
              })}

            {/* Uncategorized / General Fallback */}
            {selectedDept === "All" && (() => {
              const uncategorized = otherMembers.filter(
                (m) =>
                  !m.department ||
                  !DEPARTMENTS.includes(m.department)
              )
              if (uncategorized.length === 0) return null

              return (
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold text-foreground tracking-widest font-heading uppercase text-primary">
                      General & Other
                    </h3>
                    <div className="flex-1 h-[1px] bg-border/40" />
                  </div>

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                  >
                    {uncategorized.map((member) => (
                      <motion.div key={member.id} variants={itemVariants}>
                        <TeamMemberCard
                          id={member.id}
                          name={member.name}
                          position={member.position}
                          bio={member.bio}
                          imageUrl={member.image_url}
                          email={member.email}
                          phone={member.phone}
                          socialLinks={member.social_links}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )
            })()}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-foreground/50">No other team members found.</p>
          </div>
        )}
      </div>

      {/* Culture Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-primary/5 py-24 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-black/5 dark:bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-foreground mb-6">Our Culture</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8" />
          <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
            We believe in fostering a collaborative environment where innovation thrives, creativity flourishes, and
            every team member contributes to shaping tomorrow's architecture. Our commitment to excellence and
            sustainable design drives everything we do.
          </p>
        </div>
      </motion.div>
    </main>
  )
}
