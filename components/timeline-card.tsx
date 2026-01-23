
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { TimelineItem } from "@/data/timeline";
import { cn } from "@/lib/utils";

type TimelineCardProps = {
  item: TimelineItem;
};

export function TimelineCard({ item }: TimelineCardProps) {
  return (
    <motion.article
      className={cn(
        "relative rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm",
        item.highlighted && "border-primary/60 bg-primary/5",
      )}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        <span>{item.date}</span>
        {item.organization && (
          <>
            <span className="text-muted-foreground/60">-</span>
            <span>{item.organization}</span>
          </>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
        <span className="inline-flex items-center gap-1 rounded-full border border-border/60 px-3 py-1 text-[11px] text-muted-foreground">
          <MapPin className="h-3 w-3 text-primary" />
          {item.location}
        </span>
      </div>
      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
        {item.description}
      </p>
    </motion.article>
  );
}
