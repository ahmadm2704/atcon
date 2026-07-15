"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  FileText,
  Users,
  MessageSquare,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  Activity,
  ChevronRight,
  Plus
} from "lucide-react"
import { createClient } from "@/lib/supabase"
import { motion } from "framer-motion"

function timeAgo(dateString: string) {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    projects: 0,
    team: 0,
    messages: 0,
    unreadMessages: 0,
    testimonials: 0
  })
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const supabase = createClient()
        
        const [
          { count: projectsCount },
          { count: teamCount },
          { data: messages },
          { count: testimonialsCount },
          { data: recentProjects }
        ] = await Promise.all([
          supabase.from("projects").select("*", { count: 'exact', head: true }),
          supabase.from("team").select("*", { count: 'exact', head: true }),
          supabase.from("contact_messages").select("status, created_at, name"),
          supabase.from("testimonials").select("*", { count: 'exact', head: true }),
          supabase.from("projects").select("title, created_at").order('created_at', { ascending: false }).limit(4)
        ])

        const unread = messages?.filter((m: any) => m.status === 'new').length || 0;
        const totalMessages = messages?.length || 0;

        setStats({
          projects: projectsCount || 0,
          team: teamCount || 0,
          messages: totalMessages,
          unreadMessages: unread,
          testimonials: testimonialsCount || 0
        })

        let recentActivity: any[] = [];
        if (recentProjects) {
          recentActivity = [...recentActivity, ...recentProjects.map((p: any) => ({
            title: `New Project: ${p.title}`,
            date: p.created_at,
            type: 'project'
          }))];
        }
        if (messages) {
           const recentMsgs = [...messages].sort((a: any,b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0,4)
           recentActivity = [...recentActivity, ...recentMsgs.map((m: any) => ({
             title: `New Message from ${m.name || 'Visitor'}`,
             date: m.created_at,
             type: 'message'
           }))];
        }
        
        recentActivity = recentActivity.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);
        setActivities(recentActivity)

      } catch (error) {
        console.error("Failed to fetch dashboard stats", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="relative min-h-full space-y-8 pb-10">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl -z-10 blur-3xl opacity-50" />
      <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Dashboard Overview
          </h2>
          <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
            Welcome back to the ATCON Command Center. Monitor your digital presence and incoming leads in real-time.
          </p>
        </div>
        <Link href="/admin/projects/new" className="hidden md:inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:scale-105 active:scale-95">
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Link>
      </motion.div>

      {/* Main Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard
          title="Total Projects"
          value={stats.projects.toString()}
          icon={FileText}
          description="Live portfolio items"
          loading={loading}
          delay={0}
        />
        <StatsCard
          title="Team Members"
          value={stats.team.toString()}
          icon={Users}
          description="Active staff members"
          loading={loading}
          delay={0.1}
        />
        <StatsCard
          title="Unread Messages"
          value={stats.unreadMessages.toString()}
          icon={MessageSquare}
          description={stats.messages > 0 ? `Out of ${stats.messages} total messages` : 'No messages yet'}
          loading={loading}
          highlight={stats.unreadMessages > 0}
          delay={0.2}
        />
        <StatsCard
          title="Testimonials"
          value={stats.testimonials.toString()}
          icon={CheckCircle2}
          description="Verified client feedback"
          loading={loading}
          delay={0.3}
        />
      </motion.div>

      <div className="grid gap-6 md:grid-cols-12 lg:gap-8">
        {/* Quick Actions Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="col-span-12 lg:col-span-7 bg-card/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-8 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="font-bold text-2xl flex items-center gap-3">
               <span className="p-2 bg-primary/10 rounded-xl"><TrendingUp className="w-5 h-5 text-primary" /></span>
               Quick Actions
            </h3>
          </div>
          
          <div className="grid gap-5 sm:grid-cols-2 relative z-10">
            <QuickAction
              href="/admin/projects/new"
              title="Publish Project"
              description="Add a new masterpiece to your portfolio"
              icon={FileText}
              color="bg-blue-500/10 text-blue-600 dark:text-blue-400"
            />
            <QuickAction
              href="/admin/messages"
              title="View Messages"
              description="Check your incoming client inquiries"
              icon={MessageSquare}
              color="bg-green-500/10 text-green-600 dark:text-green-400"
            />
            <QuickAction
              href="/admin/media/new"
              title="Upload Media"
              description="Add photos or videos to the main gallery"
              icon={ArrowUpRight}
              color="bg-purple-500/10 text-purple-600 dark:text-purple-400"
            />
            <QuickAction
              href="/admin/team/new"
              title="Add Team Member"
              description="Register a new employee profile"
              icon={Users}
              color="bg-orange-500/10 text-orange-600 dark:text-orange-400"
            />
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="col-span-12 lg:col-span-5 bg-card/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-8 flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-2xl flex items-center gap-3">
              <span className="p-2 bg-primary/10 rounded-xl"><Activity className="w-5 h-5 text-primary" /></span>
              Live Activity
            </h3>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          </div>
          
          <div className="flex-1 relative">
            {/* Timeline Line */}
            <div className="absolute left-[11px] top-4 bottom-4 w-px bg-border/50" />
            
            <div className="space-y-6 relative z-10">
              {loading ? (
                <div className="space-y-6">
                   {[1, 2, 3, 4].map((i) => (
                     <div key={i} className="flex items-start gap-4">
                       <div className="w-6 h-6 rounded-full bg-muted animate-pulse border-4 border-background flex-shrink-0" />
                       <div className="space-y-2 flex-1 pt-1">
                         <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                         <div className="h-3 bg-muted rounded animate-pulse w-1/4" />
                       </div>
                     </div>
                   ))}
                </div>
              ) : activities.length > 0 ? (
                activities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className={`w-6 h-6 rounded-full border-4 border-background flex-shrink-0 z-10 transition-transform group-hover:scale-125 ${activity.type === 'message' ? 'bg-blue-500' : 'bg-primary'}`} />
                    <div className="space-y-1 pt-0.5">
                      <p className="text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">{activity.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(activity.date)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-3 opacity-60 pt-10">
                  <div className="p-4 bg-muted/50 rounded-full">
                    <Activity className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium">No recent activity detected.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function StatsCard({ title, value, icon: Icon, description, loading, highlight, delay }: any) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24, delay } }
      }}
      className={`relative overflow-hidden p-6 rounded-3xl border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group ${
        highlight 
          ? 'bg-gradient-to-br from-primary to-red-700 border-transparent text-white shadow-primary/30' 
          : 'bg-card/50 backdrop-blur-xl text-card-foreground border-white/10 hover:border-primary/30 dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]'
      }`}
    >
      {/* Decorative background shape */}
      <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-2xl transition-opacity duration-500 ${highlight ? 'bg-white/20' : 'bg-primary/10 opacity-0 group-hover:opacity-100'}`} />

      <div className="relative z-10 flex flex-col h-full justify-between gap-4">
        <div className="flex items-center justify-between">
          <p className={`text-sm font-semibold uppercase tracking-wider ${highlight ? 'text-white/80' : 'text-muted-foreground'}`}>{title}</p>
          <div className={`p-3 rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${highlight ? 'bg-white/20 text-white shadow-inner' : 'bg-primary/10 text-primary'}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        
        <div>
          {loading ? (
            <div className={`h-10 w-20 animate-pulse rounded-lg mt-2 ${highlight ? 'bg-white/20' : 'bg-muted'}`} />
          ) : (
            <div className="text-4xl font-extrabold tracking-tight flex items-baseline gap-1">
              {value}
            </div>
          )}
          <p className={`text-sm mt-3 font-medium flex items-center gap-1.5 ${highlight ? 'text-white/80' : 'text-muted-foreground'}`}>
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function QuickAction({ href, title, description, icon: Icon, color }: any) {
  return (
    <Link
      href={href}
      className="flex flex-col p-5 rounded-2xl bg-background/40 border border-white/5 hover:bg-card hover:border-primary/30 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110 shadow-sm ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
      </div>
      <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors relative z-10">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed relative z-10">{description}</p>
    </Link>
  )
}
