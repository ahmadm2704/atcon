"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, Search } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { ProjectsNav } from "@/components/projects-nav"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { label: "HOME", href: "/" },
    { label: "PROJECTS UNDERTAKEN", href: "/projects" },
    { label: "TEAM", href: "/team" },
    { label: "EVENTS", href: "/events" },
    { label: "MEDIA", href: "/media" },
    { label: "REVIEWS", href: "/reviews" },
    { label: "CONTACT US", href: "/contact" },
  ]

  // Determine if we should use dark/solid styling
  // We use dark style if scrolled OR if we are NOT on the home page
  const useDarkStyle = scrolled || !isHome

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
        ? "bg-background/80 dark:bg-black/80 backdrop-blur-xl border-b border-border/10 dark:border-white/5 py-2 shadow-sm dark:shadow-2xl"
        : "bg-transparent py-4 border-b border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`relative flex items-center justify-start transition-all duration-300 ${scrolled ? "w-32 h-12" : "w-40 h-16"}`}>
              <Image
                src="/logo.png"
                alt="Atcon Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/"
              className={`text-sm font-bold font-heading tracking-widest hover:text-primary transition-colors uppercase ${useDarkStyle ? "text-foreground dark:text-white" : "text-white"}`}
            >
              Home
            </Link>

            <ProjectsNav scrolled={useDarkStyle} />

            <Link href="/team"
              className={`text-sm font-bold font-heading tracking-widest hover:text-primary transition-colors uppercase ${useDarkStyle ? "text-foreground dark:text-white" : "text-white"}`}
            >
              Team
            </Link>

            <Link href="/events"
              className={`text-sm font-bold font-heading tracking-widest hover:text-primary transition-colors uppercase ${useDarkStyle ? "text-foreground dark:text-white" : "text-white"}`}
            >
              Events
            </Link>

            <Link href="/media"
              className={`text-sm font-bold font-heading tracking-widest hover:text-primary transition-colors uppercase ${useDarkStyle ? "text-foreground dark:text-white" : "text-white"}`}
            >
              Media
            </Link>
            <Link href="/reviews"
              className={`text-sm font-bold font-heading tracking-widest hover:text-primary transition-colors uppercase ${useDarkStyle ? "text-foreground dark:text-white" : "text-white"}`}
            >
              Reviews
            </Link>
            <Link href="/contact"
              className={`text-sm font-bold font-heading tracking-widest hover:text-primary transition-colors uppercase ${useDarkStyle ? "text-foreground dark:text-white" : "text-white"}`}
            >
              Contact Us
            </Link>
          </div>

          {/* Desktop Right Items */}
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle className={useDarkStyle ? "text-foreground dark:text-white" : "text-white"} />
            <Button asChild className="font-bold tracking-wider bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-sm shadow-lg shadow-red-900/20">
              <Link href="/contact">GET IN TOUCH</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ModeToggle className={useDarkStyle ? "text-foreground dark:text-white" : "text-white"} />
            <button
              className={`p-2 transition-colors ${useDarkStyle ? "text-foreground dark:text-white" : "text-white"}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {
        isMenuOpen && (
          <div className="md:hidden bg-background dark:bg-black border-t border-border/10">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 text-sm font-bold text-foreground/80 dark:text-white/80 hover:text-primary hover:bg-muted/10 dark:hover:bg-white/5 rounded-lg transition-colors font-heading"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )
      }
    </nav >
  )
}
