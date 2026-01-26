import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Clock } from "lucide-react";
import { TechBadge } from "@/components/tech-badge";
import { cn } from "@/lib/utils";

type PostCardListingProps = {
    href: string;
    title: string;
    excerpt?: string | null;
    coverImage?: string | null;
    date: string;
    readingTime?: string;
    tags?: string[];
    typeLabel?: "Blog" | "Journal";
};

export function PostCardListing({
    href,
    title,
    excerpt,
    coverImage,
    date,
    readingTime,
    tags,
    typeLabel,
}: PostCardListingProps) {
    return (
        <article
            className={cn(
                "group flex flex-col overflow-hidden rounded-3xl",
                "border border-border/70 bg-card/80 shadow-sm",
                "transition-all duration-200 ease-out",
                "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5",
                "motion-reduce:transition-none motion-reduce:transform-none"
            )}
        >
            <Link href={href} className="flex h-full flex-col">
                {/* Cover Image - Constrained */}
                {coverImage ? (
                    <div className="relative aspect-[16/9] max-h-[200px] w-full overflow-hidden bg-muted">
                        <Image
                            src={coverImage}
                            alt={title}
                            fill
                            className={cn(
                                "object-cover transition-transform duration-500",
                                "group-hover:scale-105",
                                "motion-reduce:transition-none motion-reduce:transform-none"
                            )}
                        />
                    </div>
                ) : (
                    /* Subtle placeholder for missing cover */
                    <div className="aspect-[16/9] max-h-[200px] w-full bg-gradient-to-br from-slate-100 via-slate-50 to-white dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800" />
                )}

                {/* Content */}
                <div className="flex flex-1 flex-col space-y-3 p-5 sm:p-6">
                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
                        {typeLabel && (
                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                                {typeLabel}
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-primary/70" />
                            {formatDate(date)}
                        </span>
                        {readingTime && (
                            <span className="inline-flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-primary/70" />
                                {readingTime}
                            </span>
                        )}
                    </div>

                    {/* Title + Excerpt */}
                    <div className="flex-1 space-y-2">
                        <h3
                            className={cn(
                                "text-lg font-semibold leading-tight text-foreground line-clamp-2",
                                "transition-colors group-hover:text-primary",
                                "motion-reduce:transition-none"
                            )}
                        >
                            {title}
                        </h3>
                        {excerpt && (
                            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                                {excerpt}
                            </p>
                        )}
                    </div>

                    {/* Tags - Controlled height */}
                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 max-h-14 overflow-hidden">
                            {tags.slice(0, 4).map((tag) => (
                                <TechBadge key={tag} label={tag} className="text-xs" />
                            ))}
                            {tags.length > 4 && (
                                <span className="self-center text-[10px] text-muted-foreground">
                                    +{tags.length - 4}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </Link>
        </article>
    );
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
