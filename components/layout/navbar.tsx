"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navigation, siteConfig } from "@/data/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md">
      <div className="border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-content-xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 text-sm font-semibold text-foreground ring-focus"
          >
            {/* Brand Logo Monogram */}
            <Image
              src="/brand/logo-monogram.svg"
              alt="SH Logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-xl shadow-sm transition-transform hover:scale-105"
            />
            {/* Wordmark (for tablet+) or Text Fallback */}
            <span className="hidden text-base font-bold tracking-tight sm:inline">
              Shahadat
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                    isActive && "text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-foreground/[0.08]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="hidden md:inline-flex"
            >
              <Link href="/contact">Let&apos;s collaborate</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open navigation menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <Dialog
            as={motion.div}
            static
            open={open}
            onClose={setOpen}
            className="relative z-50 md:hidden"
          >
            <motion.div
              className="fixed inset-0 bg-background/70 backdrop-blur-sm"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <div className="fixed inset-x-4 top-14">
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <DialogPanel className="rounded-3xl border border-border/80 bg-card/95 p-4 shadow-soft">
                  <div className="flex items-center justify-between pb-2">
                    <DialogTitle className="text-sm font-medium text-muted-foreground">
                      Navigate
                    </DialogTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Close navigation menu"
                      onClick={() => setOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-1">
                    {navigation.map((item) => {
                      const isActive =
                        item.href === "/"
                          ? pathname === "/"
                          : pathname?.startsWith(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "rounded-2xl px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground",
                            isActive && "bg-foreground/10 text-foreground",
                          )}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </DialogPanel>
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </header>
  );
}

