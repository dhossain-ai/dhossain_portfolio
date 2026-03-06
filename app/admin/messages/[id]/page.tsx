import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMessage, updateMessageStatus, type ContactMessageStatus } from '../actions'
import { ArrowLeft, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusActions, type IconName } from './status-actions'

type Props = {
  params: Promise<{ id: string }>
}

export default async function MessageDetailPage({ params }: Props) {
  const { id } = await params
  const message = await getMessage(id)

  if (!message) {
    notFound()
  }

  const statusOptions: { value: ContactMessageStatus; label: string; iconName: IconName }[] = [
    { value: 'unread', label: 'Mark Unread', iconName: 'mail' },
    { value: 'read', label: 'Mark Read', iconName: 'mail-open' },
    { value: 'replied', label: 'Mark Replied', iconName: 'reply' },
    { value: 'archived', label: 'Archive', iconName: 'archive' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/messages">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Message Details</h2>
          <p className="text-muted-foreground">
            {new Date(message.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold">{message.name}</h3>
                <a
                  href={`mailto:${message.email}`}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <Mail className="h-3 w-3" />
                  {message.email}
                </a>
              </div>
              <StatusBadge status={message.status} />
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>

          {message.ip_address && (
            <div className="text-xs text-muted-foreground">
              <p>IP: {message.ip_address}</p>
              {message.user_agent && <p className="truncate">UA: {message.user_agent}</p>}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-medium mb-3">Actions</h4>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <StatusActions
                  key={option.value}
                  messageId={message.id}
                  currentStatus={message.status}
                  status={option.value}
                  label={option.label}
                  iconName={option.iconName}
                />
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-medium mb-3">Info</h4>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">ID:</dt>
                <dd className="font-mono text-xs truncate max-w-[150px]">{message.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Created:</dt>
                <dd>{new Date(message.created_at).toLocaleDateString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Updated:</dt>
                <dd>{new Date(message.updated_at).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    unread: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    read: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    replied: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    archived: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  }

  return (
    <span className={`text-xs px-2 py-1 rounded-full capitalize ${styles[status] || styles.read}`}>
      {status}
    </span>
  )
}
