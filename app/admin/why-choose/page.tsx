"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"
import { Edit2 } from "lucide-react"

interface WhyChooseContent {
  id: string
  title: string
  description: string
}

export default function WhyChooseAdminPage() {
  const router = useRouter()
  const [content, setContent] = useState<WhyChooseContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkAuth = () => {
      const adminEmail = localStorage.getItem("adminEmail")
      if (!adminEmail) {
        router.push("/admin/login")
        return
      }
      fetchContent()
    }

    checkAuth()
  }, [router])

  const fetchContent = async () => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const { data, error: fetchError } = await supabase.from("why_choose").select("*").single()

      if (fetchError && fetchError.code !== "PGRST116") throw fetchError
      setContent(data || { id: "default", title: "WHY CHOOSE ATCON?", description: "" })
    } catch (err) {
      setError("Failed to fetch content")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Manage "Why Choose ATCON" Section</h1>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

      {content ? (
        <Link href={`/admin/why-choose/edit/${content.id}`}>
          <Button className="bg-primary text-white mb-8">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Content
          </Button>
        </Link>
      ) : null}

      {content && (
        <div className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-bold text-primary mb-4">{content.title}</h2>
          <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{content.description}</p>
        </div>
      )}
    </div>
  )
}
