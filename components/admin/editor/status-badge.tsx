'use client'

interface StatusBadgeProps {
    status: 'draft' | 'published'
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const isPublished = status === 'published'

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                isPublished
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}
        >
            {isPublished ? 'Published' : 'Draft'}
        </span>
    )
}
