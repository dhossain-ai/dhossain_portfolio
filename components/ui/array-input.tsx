
import React, { useState, KeyboardEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Plus } from 'lucide-react'

type ArrayInputProps = {
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
}

export function ArrayInput({ value = [], onChange, placeholder }: ArrayInputProps) {
    const [inputValue, setInputValue] = useState('')

    const addValue = () => {
        const trimmed = inputValue.trim()
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed])
            setInputValue('')
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addValue()
        }
    }

    const removeValue = (indexToRemove: number) => {
        onChange(value.filter((_, index) => index !== indexToRemove))
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder || 'Type and press enter...'}
                    className="flex-1"
                />
                <Button type="button" variant="secondary" onClick={addValue} size="icon">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
                {value.length > 0 ? (
                    value.map((item, index) => (
                        <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 gap-1">
                            {item}
                            <button
                                type="button"
                                onClick={() => removeValue(index)}
                                className="ml-1 hover:text-destructive focus:outline-none"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))
                ) : (
                    <span className="text-muted-foreground text-xs italic py-1">No items added.</span>
                )}
            </div>
        </div>
    )
}
