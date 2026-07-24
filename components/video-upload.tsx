"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@supabase/ssr"
import { Video, Loader2, X } from "lucide-react"

interface VideoUploadProps {
    value: string
    onChange: (url: string) => void
    disabled?: boolean
}

export function VideoUpload({
    value,
    onChange,
    disabled,
}: VideoUploadProps) {
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

            const fileExt = file.name.split(".").pop()
            const fileName = `video_${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            // Use the images bucket as it's typically configured for public assets
            const { error: uploadError } = await supabase.storage
                .from("images")
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage
                .from("images")
                .getPublicUrl(filePath)

            onChange(data.publicUrl)
        } catch (error: any) {
            console.error("Error uploading video:", error)
            alert(`Error uploading video: ${error.message || "Unknown error"}. Check console for details.`)
        } finally {
            setIsUploading(false)
        }
    }

    if (value) {
        return (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-muted group">
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
                <video
                    className="w-full h-full object-cover"
                    src={value}
                    controls
                />
            </div>
        )
    }

    return (
        <div className="w-full space-y-4">
            <label className="w-full aspect-video flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? (
                        <>
                            <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-2" />
                            <p className="text-sm text-muted-foreground">Uploading video...</p>
                        </>
                    ) : (
                        <>
                            <Video className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="mb-2 text-sm text-foreground font-medium">Click to upload local video</p>
                            <p className="text-xs text-muted-foreground">MP4, WebM, or OGG</p>
                        </>
                    )}
                </div>
                <input
                    type="file"
                    className="hidden"
                    onChange={onUpload}
                    accept="video/*"
                    disabled={disabled || isUploading}
                />
            </label>
        </div>
    )
}
