
'use client'

import { Link as LinkIcon, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CldUploadWidget } from 'next-cloudinary'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'

type EditorToolbarProps = {
    onInsert: (text: string) => void
}

export function EditorToolbar({ onInsert }: EditorToolbarProps) {
    const [urlModalOpen, setUrlModalOpen] = useState(false)
    const [urlInput, setUrlInput] = useState('')
    const [altInput, setAltInput] = useState('')

    const handleUrlInsert = () => {
        if (urlInput) {
            const markdown = `![${altInput || 'image'}](${urlInput})`
            onInsert(markdown)
            setUrlModalOpen(false)
            setUrlInput('')
            setAltInput('')
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpload = (result: any) => {
        if (result.info?.secure_url) {
            const markdown = `![${result.info.original_filename || 'image'}](${result.info.secure_url})`
            onInsert(markdown)
        }
    }

    return (
        <div className="flex items-center gap-1 border-b bg-muted/20 p-1">
            <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={handleUpload}
                options={{
                    sources: ['local', 'url', 'unsplash'],
                    multiple: false,
                    clientAllowedFormats: ['image'],
                    maxImageFileSize: 2000000, // 2MB
                }}
            >
                {({ open }) => (
                    <Button type="button" variant="ghost" size="sm" onClick={() => open()} title="Upload Image">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                    </Button>
                )}
            </CldUploadWidget>

            <Dialog open={urlModalOpen} onOpenChange={setUrlModalOpen}>
                <DialogTrigger asChild>
                    <Button type="button" variant="ghost" size="sm" title="Insert Image by URL">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Image URL
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert Image from URL</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="url">Image URL</Label>
                            <Input id="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://example.com/image.png" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="alt">Alt Text</Label>
                            <Input id="alt" value={altInput} onChange={(e) => setAltInput(e.target.value)} placeholder="Description of image" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleUrlInsert}>Insert</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
