"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutGrid,
    FileText,
    Users,
    ImageIcon,
    MessageSquare,
    Settings,
    HelpCircle,
    Briefcase,
    Star,
    ShieldCheck,
    Building2,
    KeyRound,
    Calendar
} from "lucide-react"

const menuItems = [
    { icon: LayoutGrid, label: "Dashboard", href: "/admin/dashboard" },
    { icon: ImageIcon, label: "Hero Section", href: "/admin/hero" },
    { icon: Briefcase, label: "Projects", href: "/admin/projects" },
    { icon: Calendar, label: "Events", href: "/admin/events" },
    { icon: Users, label: "Team Members", href: "/admin/team" },
    { icon: ImageIcon, label: "Media", href: "/admin/media" },
    { icon: Settings, label: "Services", href: "/admin/services" },
    { icon: Building2, label: "Clients", href: "/admin/clients" },
    { icon: ShieldCheck, label: "Why Choose", href: "/admin/why-choose" },
    { icon: Star, label: "Testimonials", href: "/admin/testimonials" },
    { icon: MessageSquare, label: "Messages", href: "/admin/messages" },
    { icon: KeyRound, label: "Change Password", href: "/admin/change-password" },
]

interface AdminSidebarProps {
    isOpen?: boolean
    onClose?: () => void
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname()

    return (
        <aside
            className={cn(
                "fixed md:sticky top-0 left-0 z-30 w-64 h-screen bg-card border-r border-border transition-transform duration-300 ease-in-out md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-border">
                    <Link href="/admin/dashboard" className="flex items-center gap-3">
                        <div className="relative w-32 h-10">
                            <Image
                                src="/logo.png"
                                alt="ATCON Admin"
                                fill
                                className="object-contain object-left dark:invert"
                            />
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 px-3 py-2 text-muted-foreground text-sm">
                        <HelpCircle className="w-4 h-4" />
                        <span>Help & Support</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}
