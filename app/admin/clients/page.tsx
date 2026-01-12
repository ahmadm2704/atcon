"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"
import { Plus, Trash2 } from "lucide-react"

interface Client {
  id: string
  name: string
  logo_url: string
  created_at: string
}

export default function ClientsAdminPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkAuth = () => {
      const adminEmail = localStorage.getItem("adminEmail")
      if (!adminEmail) {
        router.push("/admin/login")
        return
      }
      fetchClients()
    }

    checkAuth()
  }, [router])

  const fetchClients = async () => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const { data, error: fetchError } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError
      setClients(data || [])
    } catch (err) {
      setError("Failed to fetch clients")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const { error } = await supabase.from("clients").delete().eq("id", id)

      if (error) throw error
      setClients(clients.filter((c) => c.id !== id))
    } catch (err) {
      setError("Failed to delete client")
      console.error(err)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Clients</h1>
        <Link href="/admin/clients/new">
          <Button className="bg-primary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </Link>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

      {clients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-foreground/60 mb-4">No clients added yet</p>
          <Link href="/admin/clients/new">
            <Button className="bg-primary text-white">Add Your First Client</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={client.logo_url || "/placeholder.svg"}
                  alt={client.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground truncate">{client.name}</h3>
                <p className="text-sm text-foreground/60 mb-4">{new Date(client.created_at).toLocaleDateString()}</p>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
