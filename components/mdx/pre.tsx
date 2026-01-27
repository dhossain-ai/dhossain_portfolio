"use client"

import * as React from "react"
import { CopyButton } from "@/components/mdx/copy-button"
import { cn } from "@/lib/utils"

export function Pre({
    children,
    className,
    title, // Prop passed by rehype-pretty-code if styled
    ...props
}: React.HTMLAttributes<HTMLPreElement> & { title?: string; raw?: string }) {
    const preRef = React.useRef<HTMLPreElement>(null)
    const [text, setText] = React.useState<string>("")

    React.useEffect(() => {
        if (preRef.current) {
            // We want the text content of the code block.
            // rehype-pretty-code might structure it in spans.
            // innerText seems safely robust for now.
            setText(preRef.current.textContent || "")
        }
    }, [])

    return (
        <div className="relative group my-6 overflow-hidden rounded-xl border border-border/50 bg-[#1e1e1e] dark:border-border">
            {/* Optional Title Bar if we configure rehype-pretty-code to pass title */}
            {title && (
                <div className="flex items-center gap-2 border-b border-border/50 bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
                    <span>{title}</span>
                </div>
            )}

            <div className="absolute right-4 top-4 z-20 opacity-0 transition-opacity group-hover:opacity-100">
                <CopyButton value={text} />
            </div>

            <pre
                ref={preRef}
                className={cn(
                    "overflow-x-auto py-4 px-4 text-sm leading-6",
                    className
                )}
                {...props}
            >
                {children}
            </pre>
        </div>
    )
}
