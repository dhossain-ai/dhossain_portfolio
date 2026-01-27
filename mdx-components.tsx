
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Pre } from "@/components/mdx/pre";

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      {...props}
      className={cn(
        "mt-2 scroll-m-20 text-4xl font-bold tracking-tight text-foreground",
        props.className,
      )}
    />
  ),
  h2: (props) => (
    <h2
      {...props}
      className={cn(
        "mt-10 scroll-m-20 border-b pb-1 text-3xl font-bold tracking-tight text-foreground first:mt-0",
        "[&_a]:!text-foreground [&_a]:!no-underline [&_a]:!decoration-transparent [&_a]:hover:!text-foreground", // Force override link styles
        props.className,
      )}
    />
  ),
  h3: (props) => (
    <h3
      {...props}
      className={cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight text-foreground",
        "[&_a]:!text-foreground [&_a]:!no-underline [&_a]:!decoration-transparent [&_a]:hover:!text-foreground",
        props.className,
      )}
    />
  ),
  h4: (props) => (
    <h4
      {...props}
      className={cn(
        "mt-8 scroll-m-20 text-xl font-semibold tracking-tight text-foreground",
        "[&_a]:!text-foreground [&_a]:!no-underline [&_a]:!decoration-transparent [&_a]:hover:!text-foreground",
        props.className,
      )}
    />
  ),
  h5: (props) => (
    <h5
      {...props}
      className={cn(
        "mt-8 scroll-m-20 text-lg font-semibold tracking-tight text-foreground",
        "[&_a]:!text-foreground [&_a]:!no-underline [&_a]:!decoration-transparent [&_a]:hover:!text-foreground",
        props.className,
      )}
    />
  ),
  h6: (props) => (
    <h6
      {...props}
      className={cn(
        "mt-8 scroll-m-20 text-base font-semibold tracking-tight text-foreground",
        "[&_a]:!text-foreground [&_a]:!no-underline [&_a]:!decoration-transparent [&_a]:hover:!text-foreground",
        props.className,
      )}
    />
  ),
  p: (props) => (
    <p
      {...props}
      className={cn("leading-7 [&:not(:first-child)]:mt-6 text-foreground/90", props.className)}
    />
  ),
  a: (props) => (
    <Link
      href={props.href as string}
      className={cn(
        "font-medium text-primary underline underline-offset-4 decoration-primary/50 hover:decoration-primary transition-colors",
        props.className,
      )}
      {...props}
    >
      {props.children}
    </Link>
  ),
  ul: (props) => (
    <ul
      {...props}
      className={cn(
        "my-6 ml-6 list-disc [&>li]:mt-2 text-foreground marker:text-primary",
        props.className,
      )}
    />
  ),
  ol: (props) => (
    <ol
      {...props}
      className={cn(
        "my-6 ml-6 list-decimal [&>li]:mt-2 text-foreground marker:text-primary",
        props.className,
      )}
    />
  ),
  li: (props) => (
    <li
      {...props}
      className={cn("mt-2 text-foreground/90", props.className)}
    />
  ),
  strong: (props) => (
    <strong
      {...props}
      className={cn("font-bold text-foreground", props.className)}
    />
  ),
  blockquote: (props) => (
    <blockquote
      {...props}
      className={cn(
        "mt-6 border-l-4 border-primary/20 pl-6 italic text-muted-foreground",
        props.className,
      )}
    />
  ),
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img
      {...props}
      alt={props.alt || ""}
      className={cn("rounded-xl border bg-muted transition-colors my-8 shadow-sm", props.className)}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  ),
  hr: ({ ...props }) => <hr className="my-8 border-border" {...props} />,
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto rounded-lg border bg-card">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn("m-0 border-t p-0 even:bg-muted/30", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold text-foreground [&[align=center]]:text-center [&[align=right]]:text-right bg-muted/50",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "border px-4 py-2 text-left text-foreground [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  pre: Pre,
  code: (props) => (
    <code
      {...props}
      className={cn(
        "relative rounded bg-muted/50 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground border border-border/50",
        props.className,
      )}
    />
  ),
};

