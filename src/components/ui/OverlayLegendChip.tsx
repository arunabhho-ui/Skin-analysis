"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface OverlayLegendChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  color: string;
  active: boolean;
  count?: number;
}

export function OverlayLegendChip({
  className,
  label,
  color,
  active,
  count,
  ...props
}: OverlayLegendChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border select-none",
        active
          ? "bg-white text-brand-charcoal border-brand-stoneBorder shadow-soft-sm ring-1 ring-black/5"
          : "bg-brand-parchment/60 text-brand-charcoalMuted/80 border-transparent hover:border-brand-stoneBorder/60 hover:text-brand-charcoal opacity-60 hover:opacity-100",
        className
      )}
      {...props}
    >
      <span
        className="w-2.5 h-2.5 rounded-full transition-transform flex-shrink-0 flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        {active && <span className="w-1 h-1 rounded-full bg-white/80" />}
      </span>
      <span>{label}</span>
      {count !== undefined && (
        <span className="text-[10px] text-brand-charcoalMuted/70 tabular-nums">
          ({count})
        </span>
      )}
    </button>
  );
}
