"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { ImageUpload } from "@/components/image-upload"

const CATEGORIES = [
    "Residential",
    "Military",
    "Mechanical Works",
    "PEB Buildings",
    "Highways",
    "Educational",
    "Sports",
    "Religious",
]

export default function EditProjectPage() {
    const router = useRouter()
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [formData, setFormData] = useState({
        title: "",
        short_description: "",
        description: "",
        image_url: "",
        category: "",
        year: new Date().getFullYear(),
        status: "completed",
    })

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const supabase = createClient()
                const { data, error } = await supabase
                    .from("projects")
                    .select("*")
                    .eq("id", params.id)
                    .single()

                if (error) throw error
                if (data) {
                    setFormData({
                        title: data.title || "",
                        short_description: data.short_description || "",
                        description: data.description || "",
                        image_url: data.image_url || "",
                        category: data.category || "",
                        year: data.year || new Date().getFullYear(),
                        status: data.status || "completed",
                    })
                }
            } catch (error) {
                console.error("Error fetching project:", error)
                alert("Failed to load project details")
                router.push("/admin/projects")
            } finally {
                setIsFetching(false)
            }
        }

        if (params.id) {
            fetchProject()
        }
    }, [params.id, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === "year" ? Number.parseInt(value) : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from("projects")
                .update({
                    title: formData.title,
                    short_description: formData.short_description,
                    description: formData.description,
                    image_url: formData.image_url,
                    category: formData.category,
                    year: formData.year,
                    status: formData.status,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", params.id)

            if (error) throw error

            router.push("/admin/projects")
            router.refresh()
        } catch (error: any) {
            console.error("Error updating project:", error)
            alert(`Failed to update project: ${error.message || "Unknown error"}. Check if "client" column exists in DB.`)
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <Link
                    href="/admin/projects"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Projects
                </Link>
                <h1 className="text-3xl font-bold">Edit Project</h1>
                <p className="text-muted-foreground">Update project details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 rounded-lg border border-border shadow-sm">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Project Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Modern Villa Project"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        >
                            <option value="">Select Category</option>
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input
                            id="year"
                            name="year"
                            type="number"
                            value={formData.year}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="completed">Completed</option>
                            <option value="in-progress">In Progress</option>
                            <option value="planned">Planned</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="short_description">Short Description (List View)</Label>
                    <Input
                        id="short_description"
                        name="short_description"
                        value={formData.short_description}
                        onChange={handleChange}
                        placeholder="Brief project summary"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Full Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the project details..."
                        rows={5}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image_url">Project Image</Label>
                    <ImageUpload
                        value={formData.image_url}
                        onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                        disabled={isLoading}
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading} size="lg" className="w-full md:w-auto">
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Updating Project...
                            </>
                        ) : (
                            "Update Project"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
