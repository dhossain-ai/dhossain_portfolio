'use client'

import { useState } from 'react'
import { updateMessageStatus, type ContactMessageStatus } from '../actions'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface StatusActionsProps {
  messageId: string
  currentStatus: string
  status: ContactMessageStatus
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export function StatusActions({ messageId, currentStatus, status, label, icon: Icon }: StatusActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isCurrentStatus = currentStatus === status

  async function handleClick() {
    if (isCurrentStatus) return
    
    setIsLoading(true)
    try {
      const result = await updateMessageStatus(messageId, status)
      if (result.success) {
        toast.success(`Message marked as ${status}`)
      } else {
        toast.error('Failed to update status')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-start gap-2"
      onClick={handleClick}
      disabled={isCurrentStatus || isLoading}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  )
}
