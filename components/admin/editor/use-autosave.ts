'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { SaveState } from './save-state-indicator'

interface UseAutosaveOptions<T> {
    isEditing: boolean
    debounceMs?: number
    onAutosave: (data: T) => Promise<void>
    getData: () => T
}

interface UseAutosaveReturn {
    saveState: SaveState
    setSaveState: React.Dispatch<React.SetStateAction<SaveState>>
    watchedValues: unknown
    initialLoad: boolean
    setInitialLoad: React.Dispatch<React.SetStateAction<boolean>>
}

export function useAutosave<T>({
    isEditing,
    debounceMs = 1500,
    onAutosave,
    getData,
}: UseAutosaveOptions<T>): UseAutosaveReturn {
    const [saveState, setSaveState] = useState<SaveState>('idle')
    const [initialLoad, setInitialLoad] = useState(true)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Watch all form values
    const watchedValues = {} // This will be replaced by form.watch() in the component

    const clearAutosaveTimeout = useCallback(() => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
            typingTimeoutRef.current = null
        }
    }, [])

    // Clear initial load flag
    useEffect(() => {
        setInitialLoad(false)
    }, [])

    // Autosave effect - triggered when watchedValues change
    useEffect(() => {
        if (initialLoad) return
        if (!isEditing) return

        setSaveState('unsaved')
        clearAutosaveTimeout()

        typingTimeoutRef.current = setTimeout(async () => {
            setSaveState('saving')
            try {
                const data = getData()
                await onAutosave(data)
                setSaveState('saved')
            } catch (error) {
                console.error('Autosave error', error)
                setSaveState('failed')
            }
        }, debounceMs)

        return clearAutosaveTimeout
    }, [watchedValues, isEditing, initialLoad, debounceMs, onAutosave, getData, clearAutosaveTimeout])

    // Unsaved changes leave warning
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (saveState === 'unsaved' || saveState === 'saving') {
                e.preventDefault()
                e.returnValue = ''
            }
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [saveState])

    return {
        saveState,
        setSaveState,
        watchedValues,
        initialLoad,
        setInitialLoad,
    }
}
