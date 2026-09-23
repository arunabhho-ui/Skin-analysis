"use client";

import React, { useState } from "react";
import { ConcernItem, SkinAnalysisReport } from "@/types/analysis";
import { OverlayLegendChip } from "@/components/ui/OverlayLegendChip";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, Layers, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoMaskOverlayProps {
  imageSrc: string;
  concerns: ConcernItem[];
  activeConcerns: Record<string, boolean>;
  onToggleConcern: (id: string) => void;
  onSetAll: (active: boolean) => void;
  hoveredConcernId?: string | null;
  faceMask?: SkinAnalysisReport["faceMask"];
}

function isInsideFaceMask(point: { x: number; y: number }): boolean {
  const cx = 0.5;
  const cy = 0.52;
  const rx = 0.27;
  const ry = 0.38;
  const dx = (point.x - cx) / rx;
  const dy = (point.y - cy) / ry;
  return dx * dx + dy * dy <= 1.05;
}

function clipPolygonToFaceMask(polygon: { x: number; y: number }[]) {
  const clipped = polygon.filter((point) => isInsideFaceMask(point));
  return clipped.length >= 3 ? clipped : [];
}

export function PhotoMaskOverlay({
  imageSrc,
  concerns,
  activeConcerns,
  onToggleConcern,
  onSetAll,
  hoveredConcernId,
  faceMask,
}: PhotoMaskOverlayProps) {
  const [showOriginalOnly, setShowOriginalOnly] = useState(false);

  // SVG coordinate resolution (0..1000)
  const SVG_SIZE = 1000;

  const visibleConcerns = concerns
    .map((concern) => ({
      ...concern,
      mask: {
        regions: concern.mask.regions
          .map((polygon) => clipPolygonToFaceMask(polygon))
          .filter((polygon) => polygon.length >= 3),
      },
    }))
    .filter((concern) => concern.mask.regions.length > 0);

  const allActive = visibleConcerns.length > 0 && visibleConcerns.every((c) => activeConcerns[c.id]);
  const noneActive = visibleConcerns.length > 0 && visibleConcerns.every((c) => !activeConcerns[c.id]);

  return (
    <div className="w-full flex flex-col items-center space-y-5">
      {/* Photo + Overlay Container */}
      <div className="relative w-full max-w-2xl aspect-[3/4] sm:aspect-[4/3] rounded-3xl overflow-hidden bg-brand-charcoal border border-brand-stoneBorder shadow-soft-lg select-none">
        {/* Base Photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt="Facial skin diagnostic photo"
          className="w-full h-full object-cover transition-filter duration-300"
        />

        {/* SVG Mask Layer (Fades in smoothly) */}
        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          preserveAspectRatio="none"
          className={cn(
            "absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 ease-out",
            showOriginalOnly ? "opacity-0" : "opacity-100"
          )}
        >
          <defs>
            {/* Soft organic glow filter for dermal mask regions */}
            <filter id="dermal-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {faceMask?.regions?.map((polygon, index) => {
            const pointsString = polygon
              .map((pt) => `${pt.x * SVG_SIZE},${pt.y * SVG_SIZE}`)
              .join(" ");

            return (
              <polygon
                key={`face-mask-${index}`}
                points={pointsString}
                fill="rgba(255,255,255,0.12)"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            );
          })}

          {visibleConcerns.map((concern) => {
            const isActive = activeConcerns[concern.id];
            const isHovered = hoveredConcernId === concern.id;

            return (
              <g
                key={concern.id}
                className="transition-opacity duration-400 ease-out"
                style={{
                  opacity: isActive ? (hoveredConcernId && !isHovered ? 0.3 : 1) : 0,
                }}
                filter="url(#dermal-blur)"
              >
                {concern.mask.regions.map((polygon, polyIdx) => {
                  const pointsString = polygon
                    .map((pt) => `${pt.x * SVG_SIZE},${pt.y * SVG_SIZE}`)
                    .join(" ");

                  return (
                    <polygon
                      key={polyIdx}
                      points={pointsString}
                      fill={concern.color}
                      fillOpacity={isHovered ? 0.48 : 0.32}
                      stroke={concern.color}
                      strokeWidth={isHovered ? "2.5" : "1.8"}
                      strokeOpacity={0.85}
                      strokeLinejoin="round"
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Studio Alignment Border */}
        <div className="absolute inset-0 border border-white/20 rounded-3xl pointer-events-none" />

        {/* Floating Quick Action: Hold to inspect original photo */}
        <div className="absolute top-4 right-4 z-20">
          <button
            type="button"
            onMouseDown={() => setShowOriginalOnly(true)}
            onMouseUp={() => setShowOriginalOnly(false)}
            onTouchStart={() => setShowOriginalOnly(true)}
            onTouchEnd={() => setShowOriginalOnly(false)}
            className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white/90 hover:text-white hover:bg-black/70 text-xs font-medium flex items-center gap-1.5 transition-all shadow-soft-sm active:scale-95"
            title="Press and hold to view original photo without overlays"
          >
            {showOriginalOnly ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-brand-terracotta-light" />
                <span>Showing Raw Photo</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Hold to View Original</span>
              </>
            )}
          </button>
        </div>

        {/* Floating Badge: Active Overlays Count */}
        <div className="absolute top-4 left-4 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-bone/90 backdrop-blur-md border border-brand-stoneBorder/80 text-xs shadow-soft-sm">
          <Layers className="w-3.5 h-3.5 text-brand-terracotta" />
          <span className="font-medium text-brand-charcoal">
            {showOriginalOnly
              ? "Overlays Hidden"
              : `${visibleConcerns.filter((c) => activeConcerns[c.id]).length} Overlays Active`}
          </span>
        </div>
      </div>

      {/* Layer Toggle Legend Controls */}
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-brand-stoneBorder/80 shadow-soft-sm space-y-3">
        <div className="flex items-center justify-between border-b border-brand-stoneBorderSoft pb-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-charcoalMuted flex items-center gap-2">
            <span>Condition Mask Legend</span>
            <span className="text-[10px] font-mono text-brand-charcoalMuted/70">
              (Click to toggle layer visibility)
            </span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSetAll(true)}
              className={cn(
                "text-xs px-2.5 py-1 rounded-lg transition-colors font-medium",
                allActive
                  ? "text-brand-terracotta font-semibold bg-brand-terracotta-soft"
                  : "text-brand-charcoalMuted hover:text-brand-charcoal"
              )}
            >
              Show All
            </button>
            <span className="text-brand-stoneBorder">|</span>
            <button
              type="button"
              onClick={() => onSetAll(false)}
              className={cn(
                "text-xs px-2.5 py-1 rounded-lg transition-colors font-medium",
                noneActive
                  ? "text-brand-terracotta font-semibold bg-brand-terracotta-soft"
                  : "text-brand-charcoalMuted hover:text-brand-charcoal"
              )}
            >
              Hide All
            </button>
          </div>
        </div>

        {/* Legend Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {visibleConcerns.map((concern) => (
            <OverlayLegendChip
              key={concern.id}
              label={concern.label}
              color={concern.color}
              active={Boolean(activeConcerns[concern.id])}
              count={concern.mask.regions.length}
              onClick={() => onToggleConcern(concern.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
