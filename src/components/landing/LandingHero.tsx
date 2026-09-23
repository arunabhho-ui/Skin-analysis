"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, ShieldCheck, Sparkles, Scan, Eye } from "lucide-react";

interface LandingHeroProps {
  onStart: () => void;
}

export function LandingHero({ onStart }: LandingHeroProps) {
  return (
    <section className="relative pt-6 pb-20 sm:pb-28 overflow-hidden">
      {/* Background Soft Ambient Light */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-brand-terracotta-soft/50 via-brand-sand/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center space-y-10">
        {/* Eyebrow Pill */}
        <div className="animate-fade-in inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-sand/60 border border-brand-stoneBorder/80 text-brand-charcoalSoft text-[11px] font-mono uppercase tracking-[0.2em]">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-terracotta" />
          <span>Biometric Optical Dermatology</span>
        </div>

        {/* Display Serif Headline */}
        <div className="space-y-4 max-w-4xl">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-brand-charcoal tracking-[-0.02em] leading-[1.08]">
            An intimate appraisal of your skin’s biological architecture.
          </h1>
          <p className="font-sans text-base sm:text-lg md:text-xl text-brand-charcoalMuted max-w-2xl mx-auto font-light leading-relaxed pt-2">
            Non-invasive optical recognition calibrated for cosmetic dermatology. Assess barrier integrity, pore micro-topography, and tone — formulated into evidence-based rituals.
          </p>
        </div>

        {/* Single Clear CTA Block */}
        <div className="flex flex-col items-center space-y-3 pt-2">
          <Button
            size="lg"
            variant="terracotta"
            onClick={onStart}
            rightIcon={<ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />}
            className="group px-8 py-4 text-base shadow-soft hover:shadow-soft-md transition-all duration-300"
          >
            Begin Skin Analysis
          </Button>

          <p className="text-xs text-brand-charcoalMuted font-light tracking-wide flex items-center gap-2 pt-1">
            <span>~60 second capture</span>
            <span>•</span>
            <span>Client-side camera processing</span>
            <span>•</span>
            <span>Evidence-based actives</span>
          </p>
        </div>

        {/* Visual Showcase: The Studio Oval Guide Silhouette */}
        <div className="w-full max-w-2xl mt-12 pt-8">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl bg-gradient-to-b from-brand-parchment to-brand-bone border border-brand-stoneBorder/80 p-8 shadow-soft-lg flex flex-col items-center justify-center overflow-hidden">
            {/* Subtle decorative concentric guide rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 sm:w-80 h-80 sm:h-96 rounded-[48%] border border-brand-stoneBorder/60 opacity-60 animate-subtle-pulse" />
              <div className="absolute w-48 sm:w-60 h-64 sm:h-76 rounded-[48%] border border-brand-terracotta/30" />
            </div>

            {/* Floating Editorial Metric Callouts */}
            <div className="absolute top-6 left-6 hidden sm:flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-brand-stoneBorder/70 text-xs shadow-soft-sm">
              <Scan className="w-3.5 h-3.5 text-brand-terracotta" />
              <span className="font-medium text-brand-charcoal">Optical Pore Indexing</span>
            </div>

            <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-brand-stoneBorder/70 text-xs shadow-soft-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-terracotta" />
              <span className="font-medium text-brand-charcoal">Formulation Synthesis</span>
            </div>

            {/* Center Studio Graphic */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-brand-bone border border-brand-stoneBorder flex items-center justify-center shadow-soft-sm">
                <Eye className="w-6 h-6 text-brand-terracotta stroke-[1.5]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-brand-terracotta font-semibold">
                  Intelligent Facial Oval Guide
                </span>
                <p className="font-serif text-xl sm:text-2xl text-brand-charcoal font-normal mt-0.5">
                  Calibrated for natural ambient lighting
                </p>
              </div>
              <p className="text-xs text-brand-charcoalMuted max-w-sm font-light">
                Position face within the balanced frame. Auto-detection engages once continuous alignment is established.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
