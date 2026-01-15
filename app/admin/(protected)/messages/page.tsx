"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { MessageCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: string
  created_at: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("contact_messages").delete().eq("id", id)

      if (error) throw error
      setMessages(messages.filter((m) => m.id !== id))
      setSelectedMessage(null)
    } catch (error) {
      console.error("Error deleting message:", error)
      alert("Failed to delete message")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground">Contact Messages</h1>
          <p className="text-foreground/60">View and manage incoming contact form submissions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="md:col-span-1 bg-card border border-border rounded-lg p-4 max-h-screen overflow-y-auto">
          <h2 className="font-bold text-foreground mb-4">Messages ({messages.length})</h2>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-2">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedMessage?.id === msg.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <p className="font-medium text-sm truncate">{msg.name}</p>
                  <p className="text-xs opacity-70 truncate">{msg.subject}</p>
                  <p className="text-xs opacity-60">{new Date(msg.created_at).toLocaleDateString()}</p>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-foreground/60 text-sm">No messages yet</p>
          )}
        </div>

        {/* Message Detail */}
        <div className="md:col-span-2">
          {selectedMessage ? (
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedMessage.name}</h2>
                  <p className="text-foreground/60 text-sm">{new Date(selectedMessage.created_at).toLocaleString()}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-foreground/60">Email</label>
                  <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>

                {selectedMessage.phone && (
                  <div>
                    <label className="text-sm font-medium text-foreground/60">Phone</label>
                    <a href={`tel:${selectedMessage.phone}`} className="text-primary hover:underline">
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-foreground/60">Subject</label>
                  <p className="text-foreground">{selectedMessage.subject}</p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <label className="text-sm font-medium text-foreground/60">Message</label>
                <p className="text-foreground mt-2 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-card border border-border rounded-lg text-foreground/60">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
