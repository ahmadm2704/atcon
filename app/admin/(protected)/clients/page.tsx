"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { Plus, Trash2, Edit } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Client {
  id: string
  name: string
  logo_url: string
  order_index?: number
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("clients").select("*").order("order_index", { ascending: true })

      if (error) throw error
      setClients(data || [])
    } catch (error) {
      console.error("Error fetching clients:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("clients").delete().eq("id", id)

      if (error) throw error
      setClients(clients.filter((c) => c.id !== id))
    } catch (error) {
      console.error("Error deleting client:", error)
      alert("Failed to delete client")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Clients</h1>
            <p className="text-foreground/60">Add or remove client logos</p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/admin/clients/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : clients.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {clients.map((client) => (
              <div key={client.id} className="group relative bg-card border border-border rounded-lg p-4 flex items-center justify-center aspect-square hover:shadow-lg transition-shadow">
                <div className="relative w-full h-full">
                  <Image
                    src={client.logo_url || "/placeholder.svg?height=100&width=100"}
                    alt={client.name || "Client Logo"}
                    fill
                    className="object-contain p-2 grayscale group-hover:grayscale-0 transition-all"
                  />
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDelete(client.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs bg-black/70 text-white px-2 py-1 rounded-full">{client.name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No clients added yet</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/admin/clients/new">Add First Client</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
