"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SeverityIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 1 or 0 to 100
  type?: "bar" | "dots";
  color?: string;
  showPercent?: boolean;
}

export function SeverityIndicator({
  className,
  value,
  type = "bar",
  color,
  showPercent = false,
  ...props
}: SeverityIndicatorProps) {
  // Normalize value to 0..100
  const normalizedValue = Math.min(100, Math.max(0, value <= 1 ? Math.round(value * 100) : Math.round(value)));

  if (type === "dots") {
    // 5-point discrete scale
    const activeDots = Math.round((normalizedValue / 100) * 5);
    return (
      <div className={cn("inline-flex items-center gap-1.5", className)} {...props}>
        {[1, 2, 3, 4, 5].map((index) => {
          const isActive = index <= activeDots;
          return (
            <span
              key={index}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                isActive ? "bg-brand-charcoal" : "bg-brand-stoneBorder"
              )}
              style={isActive && color ? { backgroundColor: color } : undefined}
            />
          );
        })}
        {showPercent && (
          <span className="text-[11px] font-mono text-brand-charcoalMuted ml-1.5 tabular-nums">
            {normalizedValue}%
          </span>
        )}
      </div>
    );
  }

  // Refined hairline progress bar (2.5px tall)
  return (
    <div className={cn("flex items-center gap-3 w-full", className)} {...props}>
      <div className="flex-1 h-[3px] bg-brand-stoneBorder/70 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${normalizedValue}%`,
            backgroundColor: color || "#C47D68",
          }}
        />
      </div>
      {showPercent && (
        <span className="text-[11px] font-mono text-brand-charcoalMuted tabular-nums min-w-[2.5rem] text-right">
          {normalizedValue}%
        </span>
      )}
    </div>
  );
}
