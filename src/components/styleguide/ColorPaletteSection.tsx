"use client";

import React from "react";
import { Card } from "@/components/ui/Card";

interface Swatch {
  name: string;
  hex: string;
  role: string;
  border?: boolean;
}

const neutrals: Swatch[] = [
  { name: "Alabaster Bone", hex: "#FAF8F5", role: "Primary Background", border: true },
  { name: "Warm Parchment", hex: "#F5F2EB", role: "Cards & Surfaces", border: true },
  { name: "Subtle Sand", hex: "#EDE8E0", role: "Borders & Active Hover", border: true },
  { name: "Charcoal Muted", hex: "#6B6661", role: "Secondary / Subtitles" },
  { name: "Deep Charcoal", hex: "#1D1C1A", role: "Headings & Body Copy" },
];

const accents: Swatch[] = [
  { name: "Terracotta Soft", hex: "#F8ECE7", role: "Tint & Selection", border: true },
  { name: "Terracotta Light", hex: "#DF9B87", role: "Subtle Focus Glow" },
  { name: "Warm Terracotta", hex: "#C47D68", role: "Primary Accent & CTAs" },
  { name: "Terracotta Deep", hex: "#9E5D4A", role: "Pressed & High Contrast" },
];

const maskOverlays: Swatch[] = [
  { name: "Enlarged Pores", hex: "#C98B72", role: "Pores / T-Zone Region" },
  { name: "Fine Lines / Aging", hex: "#8E8276", role: "Peri-orbital & Forehead" },
  { name: "Blackheads", hex: "#5F7065", role: "Nasal Comedones" },
  { name: "Whiteheads", hex: "#B3A596", role: "Closed Comedones" },
  { name: "Inflammatory Acne", hex: "#C36F65", role: "Papules / Erythema" },
  { name: "Puffy Eyes", hex: "#9589A0", role: "Infraorbital Fluid" },
];

export function ColorPaletteSection() {
  const renderSwatchGrid = (swatches: Swatch[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
      {swatches.map((item) => (
        <div
          key={item.name}
          className="flex flex-col rounded-xl overflow-hidden border border-brand-stoneBorder/70 bg-white/70 shadow-soft-sm p-3 transition-transform hover:-translate-y-0.5 duration-200"
        >
          <div
            className={`w-full h-16 rounded-lg mb-2.5 transition-shadow ${
              item.border ? "border border-black/5" : ""
            }`}
            style={{ backgroundColor: item.hex }}
          />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-brand-charcoal truncate">
              {item.name}
            </span>
            <span className="text-[10px] font-mono uppercase text-brand-charcoalMuted mt-0.5">
              {item.hex}
            </span>
            <span className="text-[11px] text-brand-charcoalMuted/80 mt-1 leading-tight line-clamp-1">
              {item.role}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-charcoalMuted">
            01 / Warm Neutral Foundation
          </span>
        </div>
        {renderSwatchGrid(neutrals)}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-terracotta">
            02 / Signature Accent (Terracotta)
          </span>
        </div>
        {renderSwatchGrid(accents)}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-charcoalMuted">
            03 / Clinical Mask Overlay Palette (Condition Indicators)
          </span>
        </div>
        {renderSwatchGrid(maskOverlays)}
      </div>
    </div>
  );
}
