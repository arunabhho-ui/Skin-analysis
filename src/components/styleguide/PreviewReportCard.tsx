"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SeverityIndicator } from "@/components/ui/SeverityIndicator";
import { Sparkles, ShieldCheck, ArrowUpRight, Info } from "lucide-react";

export function PreviewReportCard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-brand-stoneBorderSoft pb-3">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta block">
            Aesthetic Verification
          </span>
          <h3 className="font-serif text-2xl text-brand-charcoal font-normal mt-0.5">
            Dermal Report & Formulation Preview
          </h3>
        </div>
        <Badge variant="terracotta" size="sm">
          Phase 1 Prototype Spec
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Metric Breakdown Column */}
        <div className="lg:col-span-6 space-y-4">
          <Card padding="md" className="space-y-5 bg-white/70">
            {/* Skin Type */}
            <div className="flex items-start justify-between border-b border-brand-stoneBorderSoft pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-brand-charcoalMuted">
                  Primary Classification
                </span>
                <h4 className="font-serif text-2xl text-brand-charcoal font-medium capitalize mt-0.5">
                  Oily / Hyper-Sebaceous
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-brand-terracotta-dark font-semibold">
                  91% Confidence
                </span>
                <span className="block text-[11px] text-brand-charcoalMuted">High certainty</span>
              </div>
            </div>

            {/* Concerns Breakdown */}
            <div>
              <span className="text-[11px] font-semibold tracking-widest uppercase text-brand-charcoalMuted block mb-3">
                Detected Morphological Concerns
              </span>
              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-medium text-brand-charcoal flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-overlay-pores" />
                      Enlarged Pores (T-Zone)
                    </span>
                    <span className="font-mono text-brand-charcoalMuted">88%</span>
                  </div>
                  <SeverityIndicator value={88} color="#C98B72" />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-medium text-brand-charcoal flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-overlay-inflammatory_acne" />
                      Inflammatory Erythema
                    </span>
                    <span className="font-mono text-brand-charcoalMuted">62%</span>
                  </div>
                  <SeverityIndicator value={62} color="#C36F65" />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-medium text-brand-charcoal flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-overlay-wrinkles" />
                      Periorbital Micro-Lines
                    </span>
                    <span className="font-mono text-brand-charcoalMuted">12%</span>
                  </div>
                  <SeverityIndicator value={12} color="#8E8276" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Evidence-Based Formulation Card */}
        <div className="lg:col-span-6 space-y-4">
          <Card padding="md" className="bg-[#FAF7F2] border-brand-terracotta/20 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-widest text-brand-terracotta font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Targeted Formulation Match
              </span>
              <Badge variant="outline" size="sm">Evidence Grade A</Badge>
            </div>

            <div>
              <span className="text-[11px] text-brand-charcoalMuted uppercase tracking-wider font-mono">
                Prescribed Active
              </span>
              <h4 className="font-serif text-2xl text-brand-charcoal font-medium mt-0.5">
                Niacinamide (2–5%) Complex
              </h4>
              <p className="text-xs sm:text-[13px] text-brand-charcoalMuted leading-relaxed mt-2 font-light">
                Clinically shown to reduce follicular sebum production, stabilize skin barrier lipid bilayers, and visibly minimize pore diameter within 28 days of topical application.
              </p>
            </div>

            <div className="pt-3 border-t border-brand-stoneBorderSoft flex items-center justify-between">
              <span className="text-[11px] text-brand-charcoalMuted">
                Suggested application: Morning & Night
              </span>
              <span className="text-xs font-medium text-brand-terracotta flex items-center gap-1">
                Learn mechanism <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Card>

          {/* Tasteful Disclaimer */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-brand-sand/40 border border-brand-stoneBorder/60 text-brand-charcoalMuted">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-charcoalMuted" />
            <p className="text-xs leading-relaxed">
              <strong className="font-medium text-brand-charcoal">Cosmetic Guidance Disclaimer:</strong> Nexzen is an optical aesthetic assessment system designed for personal skincare curation. It does not provide medical, clinical, or dermatological diagnosis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
