"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navigation } from "@/data/site";
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
    <>
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 print:hidden">
        <div className="relative flex w-full max-w-5xl items-center justify-between rounded-full border border-border/40 bg-background/60 p-2 pl-4 pr-2 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-border/60 hover:shadow-xl dark:bg-zinc-900/60">

          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-3 text-sm font-semibold text-foreground ring-focus"
          >
            <Image
              src="/brand/logo-monogram.svg"
              alt="SH Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg shadow-sm"
            />
            <span className="hidden text-base font-bold tracking-tight sm:inline">
              Shahadat
            </span>
          </Link>

          {/* Desktop Navigation */}
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
                    "relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                    isActive && "text-foreground font-semibold",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 z-[-1] rounded-full bg-foreground/5 dark:bg-white/10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Button
              asChild
              variant="primary"
              size="sm"
              className="hidden rounded-full px-5 md:flex"
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
      </header>

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
              className="fixed inset-0 bg-background/40 backdrop-blur-sm"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <div className="fixed inset-x-4 top-20">
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <DialogPanel className="rounded-3xl border border-border/80 bg-background/90 p-4 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 dark:bg-zinc-900/90">
                  <div className="flex items-center justify-between pb-4">
                    <DialogTitle className="text-sm font-medium text-muted-foreground">
                      Navigate
                    </DialogTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      aria-label="Close navigation menu"
                      onClick={() => setOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {navigation.map((item) => {
                      const isActive =
                        item.href === "/"
                          ? pathname === "/"
                          : pathname?.startsWith(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "rounded-2xl px-4 py-3 text-base font-medium transition-colors hover:bg-muted/50",
                            isActive ? "bg-muted text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                    <Button asChild className="mt-2 w-full rounded-2xl" size="lg">
                      <Link href="/contact" onClick={() => setOpen(false)}>Let&apos;s collaborate</Link>
                    </Button>
                  </div>
                </DialogPanel>
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
