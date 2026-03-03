"use client";

import Link from "next/link";
import {
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Facebook,
  MessageSquare,
} from "lucide-react";
import { socialLinks, siteConfig } from "@/data/site";

const iconMap = {
  GitHub: Github,
  LinkedIn: Linkedin,
  X: Twitter,
  YouTube: Youtube,
  Instagram: Instagram,
  Facebook: Facebook,
  Reddit: MessageSquare, // Lucide doesn't have a Reddit icon, using MessageSquare as fallback
} as const;

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background/80 print:hidden">
      <div className="mx-auto flex w-full max-w-content-xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">
            {siteConfig.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {siteConfig.tagline}
          </p>
          <p className="text-xs text-muted-foreground/80">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {socialLinks.map((link) => {
            const Icon = iconMap[link.platform];
            return (
              <Link
                key={link.platform}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.platform}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
