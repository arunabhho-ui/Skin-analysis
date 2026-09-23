"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "terracotta" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta/40 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.99] tracking-wide select-none";

    const variantStyles = {
      primary:
        "bg-brand-charcoal text-brand-bone hover:bg-brand-charcoalSoft shadow-soft-sm hover:shadow-soft",
      terracotta:
        "bg-brand-terracotta text-white hover:bg-brand-terracotta-hover shadow-soft-sm hover:shadow-soft",
      secondary:
        "bg-brand-bone/90 hover:bg-brand-sand/70 text-brand-charcoal border border-brand-stoneBorder hover:border-brand-sandDark",
      outline:
        "bg-transparent text-brand-charcoal border border-brand-stoneBorder hover:bg-brand-parchment/60",
      ghost:
        "bg-transparent text-brand-charcoalMuted hover:text-brand-charcoal hover:bg-brand-sand/50",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs rounded-lg gap-2",
      md: "h-11 px-5 text-sm rounded-xl gap-2.5",
      lg: "h-13 px-7 text-base rounded-xl gap-3",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
