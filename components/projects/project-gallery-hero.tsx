"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { Maximize2 } from "lucide-react";

type ProjectGalleryHeroProps = {
    title: string;
    coverImage?: string | null;
    galleryImages?: string[];
};

export function ProjectGalleryHero({
    title,
    coverImage,
    galleryImages = [],
}: ProjectGalleryHeroProps) {
    // Combine cover + gallery into one list
    const allImages = [
        ...(coverImage ? [coverImage] : []),
        ...(galleryImages || []),
    ].filter(Boolean);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const activeImage = allImages[selectedIndex];
    const hasImages = allImages.length > 0;
    const hasMultiple = allImages.length > 1;

    // Premium fallback for missing images
    if (!hasImages) {
        return (
            <div className="relative aspect-video w-full max-h-[520px] overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-slate-100 via-slate-50 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-sm">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground/50">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-3xl font-bold text-primary/50">
                            {title.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium">No preview available</span>
                    </div>
                </div>
            </div>
        );
    }

    const openLightbox = (index?: number) => {
        if (index !== undefined) {
            setSelectedIndex(index);
        }
        setLightboxOpen(true);
    };

    return (
        <div className="space-y-4">
            {/* Main Image - Constrained sizing */}
            <div
                className={cn(
                    "group relative aspect-video w-full max-h-[520px] overflow-hidden rounded-2xl",
                    "border border-border/50 bg-muted shadow-sm cursor-pointer",
                    "transition-shadow hover:shadow-md motion-reduce:transition-none"
                )}
                onClick={() => openLightbox()}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "absolute inset-0",
                            "motion-reduce:transition-none"
                        )}
                    >
                        <img
                            src={activeImage}
                            alt={`${title} - View ${selectedIndex + 1}`}
                            className="h-full w-full object-cover object-center"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Expand indicator on hover */}
                <div className={cn(
                    "absolute inset-0 flex items-center justify-center bg-black/0 transition-colors",
                    "group-hover:bg-black/20 motion-reduce:transition-none"
                )}>
                    <div className={cn(
                        "rounded-full bg-white/90 p-3 opacity-0 shadow-lg backdrop-blur-sm",
                        "transition-all group-hover:opacity-100 group-hover:scale-100",
                        "scale-90 motion-reduce:transition-none"
                    )}>
                        <Maximize2 className="h-5 w-5 text-zinc-700" />
                    </div>
                </div>
            </div>

            {/* Thumbnails (Only if > 1 image) */}
            {hasMultiple && (
                <div className={cn(
                    "flex gap-3 overflow-x-auto pb-2",
                    "scroll-snap-type-x mandatory scrollbar-hide",
                    "-mx-1 px-1" // Allow for focus ring overflow
                )}>
                    {allImages.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedIndex(i)}
                            className={cn(
                                "group/thumb relative flex-shrink-0 overflow-hidden rounded-xl",
                                "aspect-[16/10] w-28 sm:w-36",
                                "border bg-muted shadow-sm",
                                "scroll-snap-align-start",
                                "transition-all duration-200 ease-out",
                                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                                "motion-reduce:transition-none",
                                selectedIndex === i
                                    ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
                                    : "border-border/50 opacity-70 hover:opacity-100 hover:scale-[1.02] hover:border-primary/50"
                            )}
                        >
                            <img
                                src={img}
                                alt={`Thumbnail ${i + 1}`}
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            <ImageLightbox
                images={allImages}
                activeIndex={selectedIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                onNavigate={setSelectedIndex}
                title={title}
            />
        </div>
    );
}
