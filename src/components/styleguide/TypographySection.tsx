"use client";

import React from "react";
import { Card } from "@/components/ui/Card";

export function TypographySection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Serif Display Column */}
        <Card className="lg:col-span-7 space-y-6" padding="md">
          <div className="flex items-center justify-between border-b border-brand-stoneBorderSoft pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-terracotta">
              Editorial Display Serif — Cormorant Garamond
            </span>
            <span className="text-[11px] font-mono text-brand-charcoalMuted">
              Variable Google Font
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-mono text-brand-charcoalMuted uppercase tracking-wider block mb-1">
                Display H1 (Hero Header)
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-light text-brand-charcoal leading-[1.08] tracking-tight">
                Quiet Precision in Dermatological Analysis
              </h1>
            </div>

            <div>
              <span className="text-[10px] font-mono text-brand-charcoalMuted uppercase tracking-wider block mb-1">
                Display H2 (Section Header)
              </span>
              <h2 className="font-serif text-3xl sm:text-3xl font-normal text-brand-charcoal leading-snug">
                Personalized Formulations Derived from Cellular Insight
              </h2>
            </div>

            <div>
              <span className="text-[10px] font-mono text-brand-charcoalMuted uppercase tracking-wider block mb-1">
                Display H3 & Italic Flourish
              </span>
              <h3 className="font-serif text-2xl font-light italic text-brand-charcoalMuted leading-relaxed">
                “True radiance begins where cellular balance is restored.”
              </h3>
            </div>
          </div>
        </Card>

        {/* Sans Body Column */}
        <Card className="lg:col-span-5 space-y-6" padding="md">
          <div className="flex items-center justify-between border-b border-brand-stoneBorderSoft pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-charcoalMuted">
              Body Sans — Plus Jakarta Sans
            </span>
            <span className="text-[11px] font-mono text-brand-charcoalMuted">
              Clean Legibility
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono text-brand-charcoalMuted uppercase tracking-wider block mb-1">
                Eyebrow / Category Tracked
              </span>
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-brand-terracotta">
                BIOLOGICAL PROFILE & BARRIER INTEGRITY
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono text-brand-charcoalMuted uppercase tracking-wider block mb-1">
                Body Regular (15px / 1.6)
              </span>
              <p className="text-sm sm:text-[15px] text-brand-charcoalSoft font-normal leading-relaxed">
                Nexzen delivers laboratory-calibrated dermal diagnostics through non-invasive optical recognition. Every scan evaluates epidermal texture, lipid equilibrium, and pore topography.
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono text-brand-charcoalMuted uppercase tracking-wider block mb-1">
                Metric Label & Tabular Numerical Readout
              </span>
              <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-brand-sand/50 border border-brand-stoneBorder/60">
                <span className="text-brand-charcoalSoft font-medium">Sebum Saturation Index</span>
                <span className="font-mono text-brand-charcoal font-semibold tabular-nums">0.91 / High</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
