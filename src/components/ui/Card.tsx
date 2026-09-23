"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "parchment" | "bordered" | "interactive";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "rounded-2xl transition-all duration-300 relative";

    const variantStyles = {
      default:
        "bg-brand-parchment/70 border border-brand-stoneBorder/80 shadow-soft-sm",
      parchment:
        "bg-[#FAF7F2] border border-brand-stoneBorder/60 shadow-soft",
      bordered:
        "bg-white/40 backdrop-blur-sm border border-brand-stoneBorder shadow-none",
      interactive:
        "bg-brand-parchment/80 border border-brand-stoneBorder/80 shadow-soft-sm hover:shadow-soft-md hover:border-brand-sandDark cursor-pointer",
    };

    const paddingStyles = {
      none: "p-0",
      sm: "p-4 sm:p-5",
      md: "p-6 sm:p-7",
      lg: "p-8 sm:p-10",
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], paddingStyles[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 pb-4 border-b border-brand-stoneBorderSoft", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-serif text-2xl font-medium tracking-tight text-brand-charcoal", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs tracking-wider uppercase text-brand-charcoalMuted/90 font-medium", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pt-4", className)} {...props} />;
}
