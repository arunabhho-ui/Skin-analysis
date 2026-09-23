"use client";

import React from "react";
import { SkinAnalysisReport, ConcernItem } from "@/types/analysis";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SeverityIndicator } from "@/components/ui/SeverityIndicator";
import { Eye, EyeOff, ShieldCheck, Sparkles, Droplets, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsBreakdownProps {
  report: SkinAnalysisReport;
  activeConcerns: Record<string, boolean>;
  onToggleConcern: (id: string) => void;
  onHoverConcern?: (id: string | null) => void;
}

export function MetricsBreakdown({
  report,
  activeConcerns,
  onToggleConcern,
  onHoverConcern,
}: MetricsBreakdownProps) {
  const { skinType, concerns, aging } = report;

  const skinTypeDescriptions: Record<string, string> = {
    oily: "Elevated follicular sebum output across T-zone and cheeks, requiring balanced lipid regulation without barrier disruption.",
    dry: "Depleted intercellular lipid bilayers with reduced natural moisturizing factors (NMF), requiring ceramide and osmotic replenishment.",
    combination: "Dual-zone lipid distribution — active sebaceous excretion along the central T-zone paired with normal-to-dry lateral cheek zones.",
    normal: "Optimal stratum corneum equilibrium with balanced hydrolipidic film and resilient barrier defenses.",
  };

  return (
    <div className="space-y-6">
      {/* 1. Skin Type Section */}
      <Card padding="md" className="bg-white/85 shadow-soft border-brand-stoneBorder/80 space-y-4">
        <div className="flex items-center justify-between border-b border-brand-stoneBorderSoft pb-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-terracotta">
            01 / Primary Skin Type
          </span>
          <Badge variant="terracotta" size="sm">
            {Math.round(skinType.confidence * 100)}% Certainty
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <h3 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-normal capitalize">
              {skinType.label} Complexion
            </h3>
            <span className="text-xs font-mono text-brand-charcoalMuted">
              Confidence Index: <strong className="text-brand-charcoal tabular-nums">{(skinType.confidence * 100).toFixed(1)}%</strong>
            </span>
          </div>

          <SeverityIndicator
            value={skinType.confidence}
            color="#C47D68"
            className="pt-1"
          />

          <p className="text-xs sm:text-sm text-brand-charcoalMuted font-light leading-relaxed pt-1">
            {skinTypeDescriptions[skinType.label] ||
              "Dermal optical analysis reflects standard stratum corneum balance."}
          </p>
        </div>
      </Card>

      {/* 2. Morphological Concerns Section (Repeated per concern, sorted descending) */}
      <Card padding="md" className="bg-white/85 shadow-soft border-brand-stoneBorder/80 space-y-5">
        <div className="flex items-center justify-between border-b border-brand-stoneBorderSoft pb-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-terracotta block">
              02 / Detected Morphological Concerns
            </span>
            <p className="text-xs text-brand-charcoalMuted font-light mt-0.5">
              Ranked in descending order of detected optical prominence
            </p>
          </div>
          <span className="text-xs font-mono text-brand-charcoalMuted">
            {concerns.length} Identified
          </span>
        </div>

        <div className="space-y-3.5 divide-y divide-brand-stoneBorderSoft/60">
          {concerns.map((concern) => {
            const isActive = activeConcerns[concern.id];
            const confidencePercent = Math.round(concern.confidence * 100);

            return (
              <div
                key={concern.id}
                onMouseEnter={() => onHoverConcern?.(concern.id)}
                onMouseLeave={() => onHoverConcern?.(null)}
                className={cn(
                  "pt-3.5 first:pt-0 group transition-all duration-200 rounded-xl px-2.5 -mx-2.5 py-2",
                  "hover:bg-brand-parchment/40"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {/* Color Swatch Dot */}
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: concern.color }}
                    />
                    <span className="text-sm font-medium text-brand-charcoal">
                      {concern.label}
                    </span>
                    <span className="text-[11px] font-mono text-brand-charcoalMuted/70 hidden sm:inline-block">
                      ({concern.mask.regions.length} {concern.mask.regions.length === 1 ? "zone" : "zones"})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-brand-charcoal font-semibold tabular-nums">
                      {confidencePercent}%
                    </span>

                    {/* Quick eye toggle for this concern's mask overlay */}
                    <button
                      type="button"
                      onClick={() => onToggleConcern(concern.id)}
                      title={isActive ? "Hide mask overlay" : "Show mask overlay"}
                      className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                        isActive
                          ? "text-brand-charcoal hover:bg-brand-sand/70"
                          : "text-brand-stoneBorder hover:text-brand-charcoal hover:bg-brand-sand/50"
                      )}
                    >
                      {isActive ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Refined Hairline Indicator */}
                <SeverityIndicator
                  value={concern.confidence}
                  color={concern.color}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3. Aging Section */}
      <Card padding="md" className="bg-white/85 shadow-soft border-brand-stoneBorder/80 space-y-4">
        <div className="flex items-center justify-between border-b border-brand-stoneBorderSoft pb-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-terracotta block">
              03 / Aging & Structural Integrity
            </span>
            <p className="text-xs text-brand-charcoalMuted font-light mt-0.5">
              Micro-structural signals and periorbital tissue resilience
            </p>
          </div>
          <span className="text-xs font-mono text-brand-charcoalMuted">Baseline Index</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {aging.map((item) => {
            const percent = Math.round(item.confidence * 100);
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-brand-bone/60 border border-brand-stoneBorder/80 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-brand-charcoal">
                    {item.label}
                  </span>
                  <span className="text-xs font-mono text-brand-charcoalMuted tabular-nums">
                    {percent}%
                  </span>
                </div>

                {/* Discrete 5-pip scale for aging signals */}
                <SeverityIndicator
                  type="dots"
                  value={item.confidence}
                  color="#8E8276"
                  className="w-full justify-between"
                  showPercent={false}
                />

                <span className="text-[10px] text-brand-charcoalMuted/80 block font-light">
                  {percent < 15
                    ? "Negligible presence — skin matrix remains well-supported"
                    : percent < 35
                    ? "Minor early superficial markers detected"
                    : "Moderate textural expression detected"}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
