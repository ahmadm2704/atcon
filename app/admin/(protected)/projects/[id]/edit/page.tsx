"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase"
import { ArrowLeft, ArrowRight, Loader2, X } from "lucide-react"
import Link from "next/link"
import { ImageUpload } from "@/components/image-upload"
import Image from "next/image"

import { PROJECT_CATEGORIES } from "@/lib/constants"

export default function EditProjectPage() {
    const router = useRouter()
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [formData, setFormData] = useState<{
        title: string
        short_description: string
        description: string
        image_url: string
        category: string
        year: number
        status: string
        gallery_images: string[]
    }>({
        title: "",
        short_description: "",
        description: "",
        image_url: "",
        category: "",
        year: new Date().getFullYear(),
        status: "completed",
        gallery_images: [],
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
                        gallery_images: data.gallery_images || [],
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

    const handleAddGalleryImage = (url: string) => {
        if (url) {
            setFormData(prev => ({
                ...prev,
                gallery_images: [...prev.gallery_images, url]
            }))
        }
    }

    const handleMoveGalleryImage = (index: number, direction: 'left' | 'right') => {
        if (direction === 'left' && index === 0) return;
        if (direction === 'right' && index === formData.gallery_images.length - 1) return;

        setFormData(prev => {
            const newImages = [...prev.gallery_images];
            const swapIndex = direction === 'left' ? index - 1 : index + 1;
            [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
            return { ...prev, gallery_images: newImages };
        });
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
                    gallery_images: formData.gallery_images,
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
                            {PROJECT_CATEGORIES.map((cat) => (
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

                <div className="space-y-4">
                    <Label>Gallery Images</Label>
                    {formData.gallery_images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {formData.gallery_images.map((url, index) => (
                                <div key={index} className="relative w-full aspect-[9/16] rounded-lg overflow-hidden border border-border bg-muted group">
                                    <Image
                                        src={url}
                                        fill
                                        className="object-fill"
                                        alt={`Gallery image ${index + 1}`}
                                    />
                                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <Button
                                            type="button"
                                            onClick={() => handleMoveGalleryImage(index, 'left')}
                                            disabled={index === 0}
                                            variant="secondary"
                                            size="icon"
                                            className="h-8 w-8"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => handleMoveGalleryImage(index, 'right')}
                                            disabled={index === formData.gallery_images.length - 1}
                                            variant="secondary"
                                            size="icon"
                                            className="h-8 w-8"
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                gallery_images: prev.gallery_images.filter((_, i) => i !== index)
                                            }))}
                                            variant="destructive"
                                            size="icon"
                                            className="h-8 w-8"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="border border-dashed border-border rounded-lg p-4 bg-muted/20">
                        <span className="text-sm font-medium text-muted-foreground block mb-2">Add Gallery Image</span>
                        <ImageUpload
                            value=""
                            onChange={handleAddGalleryImage}
                            disabled={isLoading}
                        />
                    </div>
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
