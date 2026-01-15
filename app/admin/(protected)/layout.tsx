"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen bg-muted/40 overflow-hidden">
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    )
}
