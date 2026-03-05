import Link from 'next/link'
import { getMessages, getUnreadCount } from './actions'
import { MessageCircle, Search, Archive, Check, Mail, MailOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  searchParams: Promise<{ status?: string; q?: string }>
}

export default async function MessagesPage({ searchParams }: Props) {
  const params = await searchParams
  const status = params.status || 'unread'
  const search = params.q || ''

  const messages = await getMessages(status, search)
  const { unread } = await getUnreadCount()

  const filters = [
    { value: 'unread', label: 'Unread', count: unread },
    { value: 'all', label: 'All', count: null },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Messages</h2>
          <p className="text-muted-foreground">
            {unread > 0 ? `You have ${unread} unread message${unread !== 1 ? 's' : ''}` : 'No unread messages'}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {filters.map((filter) => (
            <Link key={filter.value} href={`/admin/messages?status=${filter.value}`}>
              <Button
                variant={status === filter.value ? 'primary' : 'outline'}
                size="sm"
              >
                {filter.label}
                {filter.count !== null && filter.count > 0 && (
                  <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                    {filter.count}
                  </span>
                )}
              </Button>
            </Link>
          ))}
        </div>

        <form className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              name="q"
              placeholder="Search messages..."
              defaultValue={search}
              className="h-9 w-48 rounded-md border bg-background px-9 py-1 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <Button type="submit" variant="outline" size="sm">
            Search
          </Button>
        </form>
      </div>

      <div className="rounded-md border bg-card">
        {messages.length > 0 ? (
          <div className="divide-y">
            {messages.map((message) => (
              <Link
                key={message.id}
                href={`/admin/messages/${message.id}`}
                className={`flex items-start gap-4 p-4 transition-colors hover:bg-muted/50 ${
                  message.status === 'unread' ? 'bg-muted/30' : ''
                }`}
              >
                <div className="mt-1">
                  {message.status === 'unread' ? (
                    <Mail className="h-5 w-5 text-primary" />
                  ) : (
                    <MailOpen className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-medium truncate ${message.status === 'unread' ? 'font-semibold' : ''}`}>
                      {message.name}
                    </p>
                    <p className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(message.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{message.email}</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {message.message}
                  </p>
                </div>
                <StatusBadge status={message.status} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <MessageCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p>No messages found.</p>
            {status === 'unread' && (
              <p className="text-sm">All caught up!</p>
            )}
          </div>
        )}
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
