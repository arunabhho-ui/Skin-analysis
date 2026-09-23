"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "terracotta" | "dark" | "outline" | "concern";
  size?: "sm" | "md";
  dotColor?: string;
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  dotColor,
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-sans font-medium tracking-wide transition-colors";

  const variantStyles = {
    neutral:
      "bg-brand-sand/70 text-brand-charcoalSoft border border-brand-stoneBorder/60",
    terracotta:
      "bg-brand-terracotta-soft text-brand-terracotta-dark border border-brand-terracotta/20",
    dark:
      "bg-brand-charcoal text-brand-bone border border-brand-charcoal",
    outline:
      "bg-transparent text-brand-charcoalMuted border border-brand-stoneBorder",
    concern:
      "bg-brand-bone text-brand-charcoal border border-brand-stoneBorder shadow-soft-sm",
  };

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-[11px] rounded-md gap-1.5",
    md: "px-3 py-1 text-xs rounded-lg gap-2",
  };

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {dotColor && (
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColor }}
        />
      )}
      {children}
    </span>
  );
}
