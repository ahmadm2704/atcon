"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Menu, User, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IsClient } from "@/components/is-client"

interface AdminHeaderProps {
    onMenuClick: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
    const router = useRouter()
    const [adminName, setAdminName] = useState("Admin")

    useEffect(() => {
        const name = localStorage.getItem("adminName")
        if (name) setAdminName(name)
    }, [])

    const handleLogout = async () => {
        try {
            await fetch("/api/admin/logout", { method: "POST" })
            router.push("/admin/login")
        } catch (error) {
            console.error("Logout failed", error)
        }
    }

    return (
        <header className="sticky top-0 z-20 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
            <div className="flex h-16 items-center px-4 md:px-6 gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={onMenuClick}
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>

                <div className="ml-auto flex items-center gap-4">
                    <ModeToggle />

                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                    </Button>

                    <IsClient>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=random`} alt={adminName} />
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {adminName.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{adminName}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            admin@atcon.pk
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </IsClient>
                </div>
            </div>
        </header>
    )
}
