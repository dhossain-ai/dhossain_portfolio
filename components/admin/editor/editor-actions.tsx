'use client'

import { Loader2, Save, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SaveState } from './save-state-indicator'

interface EditorActionsProps {
    isEditing: boolean
    isPending: boolean
    saveState: SaveState
    status: 'draft' | 'published'
    previewUrl?: string | null
    onPreview: () => void
    onPublish: () => void
    onUpdate: () => void
    onCreateDraft: () => void
    createLabel?: string
}

export function EditorActions({
    isEditing,
    isPending,
    saveState,
    status,
    previewUrl,
    onPreview,
    onPublish,
    onUpdate,
    onCreateDraft,
    createLabel = 'Create Draft'
}: EditorActionsProps) {
    if (!isEditing) {
        return (
            <Button type="submit" size="sm" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {createLabel}
            </Button>
        )
    }

    const isDraft = status === 'draft'
    const isSaving = saveState === 'saving'
    const canPublish = !isPending && !isSaving

    return (
        <div className="flex items-center gap-2">
            {previewUrl && (
                <Button type="button" variant="outline" size="sm" onClick={onPreview}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Preview
                </Button>
            )}

            {isDraft ? (
                <Button
                    type="button"
                    size="sm"
                    onClick={onPublish}
                    disabled={canPublish ? false : true}
                >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Publish
                </Button>
            ) : (
                <Button
                    type="button"
                    size="sm"
                    onClick={onUpdate}
                    disabled={isPending || saveState === 'saved' || saveState === 'idle'}
                >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update
                </Button>
            )}
        </div>
    )
}
