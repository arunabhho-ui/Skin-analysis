"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Camera, Layers, FlaskConical, Shield, Check } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Guided Facial Alignment",
    tagline: "Calibrated studio capture",
    description:
      "A delicate oval guide assists in centering your facial features in natural lighting. Smart in-browser edge detection activates auto-capture upon optimal stability.",
    icon: Camera,
  },
  {
    step: "02",
    title: "Morphological Mapping",
    tagline: "Multi-layered dermal evaluation",
    description:
      "Optical recognition processes skin type categorization, follicle pore volume, barrier hydration, and emerging signs of aging with localized mask overlays.",
    icon: Layers,
  },
  {
    step: "03",
    title: "Evidence-Based Actives",
    tagline: "Dermatological synthesis",
    description:
      "Every identified condition maps directly to peer-reviewed cosmetic ingredients with clinical concentrations and mechanisms of biological action.",
    icon: FlaskConical,
  },
];

const philosophyPoints = [
  "Non-comedogenic clinical standards",
  "Targeted active percentages (e.g. Niacinamide 2–5%, Salicylic Acid 1–2%)",
  "Balanced barrier restoration alongside active exfoliation",
  "Zero synthetic fragrance recommendations for reactive barriers",
];

export function MethodologySection() {
  return (
    <section className="py-20 border-t border-brand-stoneBorderSoft bg-brand-parchment/40">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 space-y-16">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
          <SectionHeader
            align="center"
            eyebrow="Clinical Protocol"
            title="Precision from Optical Capture to Targeted Active"
            description="Our methodology replaces subjective skincare guesswork with calibrated optical analysis and peer-reviewed ingredient literature."
          />
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.step}
                padding="md"
                className="bg-white/80 border-brand-stoneBorder/80 flex flex-col justify-between space-y-6 hover:shadow-soft transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-terracotta">
                      Step {item.step}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-brand-bone border border-brand-stoneBorder/80 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-brand-charcoal stroke-[1.5]" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl text-brand-charcoal font-normal">
                      {item.title}
                    </h3>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-brand-charcoalMuted/80 block mt-1">
                      {item.tagline}
                    </span>
                  </div>

                  <p className="text-sm text-brand-charcoalMuted font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Editorial Quote & Formulation Philosophy */}
        <div className="rounded-3xl bg-[#FAF7F2] border border-brand-stoneBorder p-8 sm:p-12 relative overflow-hidden shadow-soft-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta block">
                Formulation Philosophy
              </span>
              <blockquote className="font-serif text-2xl sm:text-3xl text-brand-charcoal font-light leading-snug">
                “We evaluate what is visible on the epidermis to reinforce the lipid architecture that lies beneath.”
              </blockquote>
              <p className="text-xs sm:text-sm text-brand-charcoalMuted font-light leading-relaxed">
                Formulated recommendations are non-sponsored and grounded strictly in published dermatology trials — pairing active cell turnover with ceramide-based barrier integrity.
              </p>
            </div>

            <div className="lg:col-span-5 bg-white/70 rounded-2xl p-6 border border-brand-stoneBorderSoft space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal block pb-1 border-b border-brand-stoneBorderSoft">
                Scientific Guardrails
              </span>
              <ul className="space-y-2.5">
                {philosophyPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-xs text-brand-charcoalSoft font-light">
                    <Check className="w-3.5 h-3.5 text-brand-terracotta mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
