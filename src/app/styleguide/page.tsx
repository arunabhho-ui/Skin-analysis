"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ColorPaletteSection } from "@/components/styleguide/ColorPaletteSection";
import { TypographySection } from "@/components/styleguide/TypographySection";
import { ComponentsSection } from "@/components/styleguide/ComponentsSection";
import { PreviewReportCard } from "@/components/styleguide/PreviewReportCard";
import { Palette, Type, Layers, Sparkles, CheckCircle2, ArrowLeft } from "lucide-react";

export default function StyleGuidePage() {
  const [activeTab, setActiveTab] = useState<"palette" | "typography" | "components" | "preview">("palette");

  return (
    <main className="min-h-screen bg-brand-bone text-brand-charcoal">
      {/* Top Brand Navigation Bar */}
      <header className="border-b border-brand-stoneBorder/80 bg-brand-bone/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 h-18 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-serif text-2xl tracking-[0.08em] font-normal text-brand-charcoal hover:opacity-80 transition-opacity">
              NEXZEN
            </Link>
            <span className="text-brand-stoneBorder font-light">|</span>
            <span className="text-xs uppercase font-mono tracking-widest text-brand-charcoalMuted hidden sm:inline-block">
              Design System & Style Guide
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
                Back to Landing
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12 sm:py-16 space-y-12">
        {/* Intro Section */}
        <div className="space-y-4 max-w-3xl">
          <SectionHeader
            eyebrow="Phase 1 Design System & Foundations"
            title="Quiet Confidence in Aesthetic Dermatology"
            description="A design system engineered for high-end skincare brands. Warm bone neutrals, Cormorant Garamond display serif paired with Plus Jakarta Sans, and warm terracotta accents — avoiding generic tech dashboards or clinical hospital motifs."
          />
        </div>

        {/* Segmented Navigation Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-brand-stoneBorderSoft">
          <button
            onClick={() => setActiveTab("palette")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 select-none ${
              activeTab === "palette"
                ? "bg-brand-charcoal text-brand-bone shadow-soft-sm"
                : "bg-brand-parchment/60 text-brand-charcoalMuted hover:text-brand-charcoal hover:bg-brand-sand/60"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>01 / Palette & Color</span>
          </button>

          <button
            onClick={() => setActiveTab("typography")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 select-none ${
              activeTab === "typography"
                ? "bg-brand-charcoal text-brand-bone shadow-soft-sm"
                : "bg-brand-parchment/60 text-brand-charcoalMuted hover:text-brand-charcoal hover:bg-brand-sand/60"
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>02 / Typography Hierarchy</span>
          </button>

          <button
            onClick={() => setActiveTab("components")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 select-none ${
              activeTab === "components"
                ? "bg-brand-charcoal text-brand-bone shadow-soft-sm"
                : "bg-brand-parchment/60 text-brand-charcoalMuted hover:text-brand-charcoal hover:bg-brand-sand/60"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>03 / Base UI Components</span>
          </button>

          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 select-none ${
              activeTab === "preview"
                ? "bg-brand-terracotta text-white shadow-soft-sm"
                : "bg-brand-parchment/60 text-brand-charcoalMuted hover:text-brand-charcoal hover:bg-brand-sand/60"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>04 / Report Preview Demo</span>
          </button>
        </div>

        {/* Tab Panels */}
        <div className="min-h-[480px]">
          {activeTab === "palette" && (
            <div className="space-y-6 animate-fade-in">
              <div className="max-w-2xl">
                <h3 className="font-serif text-2xl text-brand-charcoal font-normal">
                  Warm Neutrals with Restrained Terracotta Accent
                </h3>
                <p className="text-sm text-brand-charcoalMuted mt-1">
                  Inspired by Aesop, Augustinus Bader, and La Mer packaging. Soft off-whites replace clinical whites; charcoal replaces harsh #000; muted tones provide distinct recognition for facial mask conditions.
                </p>
              </div>
              <ColorPaletteSection />
            </div>
          )}

          {activeTab === "typography" && (
            <div className="space-y-6 animate-fade-in">
              <div className="max-w-2xl">
                <h3 className="font-serif text-2xl text-brand-charcoal font-normal">
                  Serif / Sans Pairing
                </h3>
                <p className="text-sm text-brand-charcoalMuted mt-1">
                  Cormorant Garamond brings editorial luxury to headlines and statement callouts, while Plus Jakarta Sans delivers crisp legibility for biometric data and clinical formulation rationales.
                </p>
              </div>
              <TypographySection />
            </div>
          )}

          {activeTab === "components" && (
            <div className="space-y-6 animate-fade-in">
              <div className="max-w-2xl">
                <h3 className="font-serif text-2xl text-brand-charcoal font-normal">
                  Tactile, Restrained Component Library
                </h3>
                <p className="text-sm text-brand-charcoalMuted mt-1">
                  Delicate borders, soft corner radii (14–16px), slender 2.5px severity progress lines, and discrete 5-pip scales ensure metrics feel informative without reading like a telemetry dashboard.
                </p>
              </div>
              <ComponentsSection />
            </div>
          )}

          {activeTab === "preview" && (
            <div className="space-y-6 animate-fade-in">
              <div className="max-w-2xl">
                <h3 className="font-serif text-2xl text-brand-charcoal font-normal">
                  Live Report Segment Preview
                </h3>
                <p className="text-sm text-brand-charcoalMuted mt-1">
                  Simulating the exact data output shape of the upcoming analysis pipeline: Skin Type, Confidence, Morphological Concerns with visual severity scales, and evidence-based recommendation cards.
                </p>
              </div>
              <PreviewReportCard />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
