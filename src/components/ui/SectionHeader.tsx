"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  className,
  eyebrow,
  title,
  description,
  align = "left",
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-3",
        align === "center" ? "text-center items-center" : "text-left items-start",
        className
      )}
      {...props}
    >
      {eyebrow && (
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-[-0.015em] text-brand-charcoal leading-[1.15]">
        {title}
      </h2>
      {description && (
        <p className="text-sm sm:text-base text-brand-charcoalMuted font-light leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
