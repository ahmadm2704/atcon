"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewClientPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    logo_url: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const adminEmail = localStorage.getItem("adminEmail")
    if (!adminEmail) {
      router.push("/admin/login")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const { error: insertError } = await supabase.from("clients").insert([
        {
          name: formData.name,
          logo_url: formData.logo_url,
        },
      ])

      if (insertError) throw insertError

      router.push("/admin/clients")
    } catch (err) {
      setError("Failed to add client")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/admin/clients" className="flex items-center gap-2 text-primary hover:underline mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Clients
      </Link>

      <h1 className="text-3xl font-bold mb-8">Add New Client</h1>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Client Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
            placeholder="Enter client name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Logo URL</label>
          <input
            type="url"
            name="logo_url"
            value={formData.logo_url}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary"
            placeholder="https://example.com/logo.png"
          />
          {formData.logo_url && (
            <div className="mt-4 flex items-center justify-center w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={formData.logo_url || "/placeholder.svg"}
                alt="Logo preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="bg-primary text-white">
            {loading ? "Adding..." : "Add Client"}
          </Button>
          <Link href="/admin/clients">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
