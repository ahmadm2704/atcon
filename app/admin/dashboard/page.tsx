"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutGrid, FileText, Users, ImageIcon, MessageSquare, LogOut, Menu, X } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [adminName, setAdminName] = useState("")

  useEffect(() => {
    // Get admin name from localStorage
    const name = localStorage.getItem("adminName") || "Admin"
    setAdminName(name)
  }, [])

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  const menuItems = [
    { icon: LayoutGrid, label: "Dashboard", href: "/admin/dashboard" },
    { icon: FileText, label: "Projects", href: "/admin/projects" },
    { icon: Users, label: "Team Members", href: "/admin/team" },
    { icon: ImageIcon, label: "Media", href: "/admin/media" },
    { icon: FileText, label: "Services", href: "/admin/services" },
    { icon: ImageIcon, label: "Clients", href: "/admin/clients" },
    { icon: FileText, label: "Why Choose", href: "/admin/why-choose" },
    { icon: MessageSquare, label: "Testimonials", href: "/admin/testimonials" },
    { icon: MessageSquare, label: "Messages", href: "/admin/messages" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              AT
            </div>
            <div>
              <h1 className="font-bold text-lg">ATCON Admin</h1>
              <p className="text-xs text-foreground/60">Content Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-foreground">{adminName}</p>
              <p className="text-xs text-foreground/60">Administrator</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="hidden md:flex bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } fixed md:relative left-0 top-0 w-64 bg-card border-r border-border pt-20 md:pt-0 transition-transform z-30 h-screen overflow-y-auto md:h-auto`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/70 hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {/* Mobile Logout */}
          <div className="md:hidden mb-6">
            <Button variant="outline" size="sm" onClick={handleLogout} className="w-full justify-center bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome to Admin Dashboard</h2>
            <p className="text-foreground/70 mb-8">
              Manage all aspects of your ATCON website - projects, team members, media, services, clients, why choose,
              testimonials, and contact messages.
            </p>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Link
                href="/admin/projects"
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground/60 text-sm">Projects</p>
                    <p className="text-3xl font-bold text-primary">Manage</p>
                  </div>
                  <FileText className="w-12 h-12 text-primary/20" />
                </div>
              </Link>

              <Link
                href="/admin/team"
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground/60 text-sm">Team Members</p>
                    <p className="text-3xl font-bold text-primary">Manage</p>
                  </div>
                  <Users className="w-12 h-12 text-primary/20" />
                </div>
              </Link>

              <Link
                href="/admin/messages"
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground/60 text-sm">Messages</p>
                    <p className="text-3xl font-bold text-primary">View</p>
                  </div>
                  <MessageSquare className="w-12 h-12 text-primary/20" />
                </div>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="text-xl font-bold text-foreground mb-6">Quick Access</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 p-4 rounded-lg hover:bg-primary/10 transition-colors group"
                    >
                      <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {item.label}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
