'use client'

import { Loader2, CheckCircle2 } from 'lucide-react'

export type SaveState = 'idle' | 'unsaved' | 'saving' | 'saved' | 'failed'

interface SaveStateIndicatorProps {
    state: SaveState
    showWhenNotEditing?: boolean
}

export function SaveStateIndicator({ state, showWhenNotEditing = false }: SaveStateIndicatorProps) {
    if (!showWhenNotEditing && state === 'idle') return null

    return (
        <span className="flex items-center text-xs font-medium">
            {state === 'saving' && (
                <span className="flex items-center text-yellow-600 dark:text-yellow-500">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Saving...
                </span>
            )}
            {state === 'saved' && (
                <span className="flex items-center text-green-600 dark:text-green-500">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Saved
                </span>
            )}
            {state === 'unsaved' && (
                <span className="text-muted-foreground">Unsaved changes</span>
            )}
            {state === 'failed' && (
                <span className="text-destructive">Save failed</span>
            )}
        </span>
    )
}
