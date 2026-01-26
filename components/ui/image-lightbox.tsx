"use client";

import { useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageLightboxProps = {
    images: string[];
    activeIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (index: number) => void;
    title?: string;
};

export function ImageLightbox({
    images,
    activeIndex,
    isOpen,
    onClose,
    onNavigate,
    title,
}: ImageLightboxProps) {
    const hasMultiple = images.length > 1;
    const currentImage = images[activeIndex];

    const goToPrev = useCallback(() => {
        if (activeIndex > 0) {
            onNavigate(activeIndex - 1);
        } else {
            onNavigate(images.length - 1); // Loop to end
        }
    }, [activeIndex, images.length, onNavigate]);

    const goToNext = useCallback(() => {
        if (activeIndex < images.length - 1) {
            onNavigate(activeIndex + 1);
        } else {
            onNavigate(0); // Loop to start
        }
    }, [activeIndex, images.length, onNavigate]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "Escape":
                    onClose();
                    break;
                case "ArrowLeft":
                    if (hasMultiple) goToPrev();
                    break;
                case "ArrowRight":
                    if (hasMultiple) goToNext();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, hasMultiple, goToPrev, goToNext, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                        "fixed inset-0 z-50 flex items-center justify-center",
                        "bg-black/90 backdrop-blur-sm",
                        "motion-reduce:transition-none"
                    )}
                    onClick={onClose}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className={cn(
                            "absolute right-4 top-4 z-50 rounded-full p-2",
                            "bg-white/10 text-white/80 backdrop-blur-sm",
                            "transition-colors hover:bg-white/20 hover:text-white",
                            "focus:outline-none focus:ring-2 focus:ring-white/50",
                            "motion-reduce:transition-none"
                        )}
                        aria-label="Close lightbox"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    {/* Image counter */}
                    {hasMultiple && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
                            {activeIndex + 1} / {images.length}
                        </div>
                    )}

                    {/* Previous button */}
                    {hasMultiple && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrev();
                            }}
                            className={cn(
                                "absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full p-3",
                                "bg-white/10 text-white/80 backdrop-blur-sm",
                                "transition-all hover:bg-white/20 hover:text-white hover:scale-110",
                                "focus:outline-none focus:ring-2 focus:ring-white/50",
                                "motion-reduce:transition-none motion-reduce:hover:scale-100"
                            )}
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="h-8 w-8" />
                        </button>
                    )}

                    {/* Main image */}
                    <motion.div
                        key={currentImage}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "relative max-h-[90vh] max-w-[90vw]",
                            "motion-reduce:transition-none"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={currentImage}
                            alt={title ? `${title} - Image ${activeIndex + 1}` : `Image ${activeIndex + 1}`}
                            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
                        />
                    </motion.div>

                    {/* Next button */}
                    {hasMultiple && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNext();
                            }}
                            className={cn(
                                "absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full p-3",
                                "bg-white/10 text-white/80 backdrop-blur-sm",
                                "transition-all hover:bg-white/20 hover:text-white hover:scale-110",
                                "focus:outline-none focus:ring-2 focus:ring-white/50",
                                "motion-reduce:transition-none motion-reduce:hover:scale-100"
                            )}
                            aria-label="Next image"
                        >
                            <ChevronRight className="h-8 w-8" />
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
