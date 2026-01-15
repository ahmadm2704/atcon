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
  TrendingUp
} from "lucide-react"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    projects: 0,
    team: 0,
    messages: 0,
    testimonials: 0
  })

  // Simulating data fetching for dashboard stats
  useEffect(() => {
    // In a real app, you would fetch these from your API
    // For now we'll simulate a loading delay
    const timer = setTimeout(() => {
      setStats({
        projects: 12,
        team: 8,
        messages: 25,
        testimonials: 15
      })
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

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
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-1">
          Welcome back to the ATCON CMS. Here's a snapshot of your site performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Projects"
          value={stats.projects.toString()}
          icon={FileText}
          description="+2 from last month"
          loading={loading}
        />
        <StatsCard
          title="Team Members"
          value={stats.team.toString()}
          icon={Users}
          description="Active staff members"
          loading={loading}
        />
        <StatsCard
          title="Messages"
          value={stats.messages.toString()}
          icon={MessageSquare}
          description="+5 unread messages"
          loading={loading}
          highlight
        />
        <StatsCard
          title="Testimonials"
          value={stats.testimonials.toString()}
          icon={CheckCircle2}
          description="Client feedback"
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 bg-card rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Quick Actions</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <QuickAction
              href="/admin/projects/new"
              title="Add New Project"
              description="Create a new project portfolio item"
              icon={FileText}
            />
            <QuickAction
              href="/admin/team/new"
              title="Add Team Member"
              description="Register a new employee profile"
              icon={Users}
            />
            <QuickAction
              href="/admin/media/new"
              title="Upload Media"
              description="Add photos to gallery"
              icon={ArrowUpRight}
            />
            <QuickAction
              href="/admin/testimonials/new"
              title="Add Testimonial"
              description="Feature a client review"
              icon={CheckCircle2}
            />
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="col-span-3 bg-card rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Recent Activity</h3>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0 border-border/50">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">New Project Added</p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsCard({ title, value, icon: Icon, description, loading, highlight }: any) {
  return (
    <div className={`p-6 rounded-xl border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${highlight ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-primary/20 shadow-primary/20' : 'bg-card text-card-foreground hover:border-primary/50'}`}>
      <div className="flex items-center justify-between space-y-0 pb-2">
        <p className={`text-sm font-medium ${highlight ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>{title}</p>
        <div className={`p-2 rounded-lg ${highlight ? 'bg-white/10' : 'bg-primary/5 text-primary'}`}>
          <Icon className={`h-4 w-4 ${highlight ? 'text-primary-foreground' : 'text-primary'}`} />
        </div>
      </div>
      <div>
        {loading ? (
          <div className={`h-8 w-16 animate-pulse rounded ${highlight ? 'bg-primary-foreground/20' : 'bg-secondary'}`} />
        ) : (
          <div className="text-3xl font-bold tracking-tight">{value}</div>
        )}
        <p className={`text-xs mt-1 font-medium ${highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{description}</p>
      </div>
    </div>
  )
}

function QuickAction({ href, title, description, icon: Icon }: any) {
  return (
    <Link
      href={href}
      className="flex flex-col p-4 rounded-lg bg-background/50 border hover:bg-accent hover:border-primary/50 transition-all duration-200 group"
    >
      <div className="p-2 w-fit rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="font-medium mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </Link>
  )
}
