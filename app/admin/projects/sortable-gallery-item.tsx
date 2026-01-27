import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X, GripVertical } from 'lucide-react'

type SortableGalleryItemProps = {
    url: string
    id: string
    onRemove: (url: string) => void
}

export function SortableGalleryItem({ url, id, onRemove }: SortableGalleryItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative aspect-video w-full overflow-hidden rounded-lg border group bg-muted"
        >
            <div
                {...attributes}
                {...listeners}
                className="absolute top-2 left-2 z-10 cursor-move rounded bg-black/50 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <GripVertical className="h-4 w-4" />
            </div>

            <Image
                src={url}
                alt="Gallery Item"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
            />

            <Button
                type="button"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm z-10"
                onClick={() => onRemove(url)}
            >
                <X className="h-3 w-3" />
            </Button>
        </div>
    )
}
