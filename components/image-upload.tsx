"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@supabase/ssr"
import { ImagePlus, Loader2, X } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    disabled?: boolean
    bucketName?: string
}

export function ImageUpload({
    value,
    onChange,
    disabled,
    bucketName = "images"
}: ImageUploadProps) {
    const [activeTab, setActiveTab] = useState<"upload" | "url">("upload")
    const [isUploading, setIsUploading] = useState(false)

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0]
            if (!file) return

            setIsUploading(true)

            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )

            // Create a unique file name
            const fileExt = file.name.split(".").pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath)

            onChange(data.publicUrl)
        } catch (error: any) {
            console.error("Error uploading image:", error)
            alert(`Error uploading image: ${error.message || "Unknown error"}. Check console for details.`)
        } finally {
            setIsUploading(false)
        }
    }

    if (value) {
        return (
            <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border bg-muted group">
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        type="button"
                        onClick={() => onChange("")}
                        variant="destructive"
                        size="icon"
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <Image
                    fill
                    className="object-cover"
                    alt="Image"
                    src={value}
                />
            </div>
        )
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
                <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "upload"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Upload File
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("url")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "url"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Image URL
                </button>
            </div>

            {activeTab === "upload" ? (
                <label className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                            <>
                                <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-2" />
                                <p className="text-sm text-muted-foreground">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                                <p className="mb-2 text-sm text-foreground font-medium">Click to upload image</p>
                                <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
                            </>
                        )}
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        onChange={onUpload}
                        accept="image/*"
                        disabled={disabled || isUploading}
                    />
                </label>
            ) : (
                <div className="space-y-2">
                    <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                    />
                    <p className="text-xs text-muted-foreground">
                        Paste a direct link to an image.
                    </p>
                </div>
            )}
        </div>
    )
}
