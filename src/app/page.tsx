"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LandingHero } from "@/components/landing/LandingHero";
import { MethodologySection } from "@/components/landing/MethodologySection";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, ArrowRight, ShieldCheck, Compass } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const handleStartAnalysis = () => {
    router.push("/capture");
  };

  return (
    <div className="min-h-screen bg-brand-bone text-brand-charcoal flex flex-col justify-between selection:bg-brand-terracotta-soft selection:text-brand-terracotta-dark">
      {/* Top Editorial Header */}
      <header className="border-b border-brand-stoneBorder/70 bg-brand-bone/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-serif text-2xl sm:text-3xl tracking-[0.1em] font-normal text-brand-charcoal hover:opacity-85 transition-opacity"
            >
              NEXZEN
            </Link>
            <span className="text-brand-stoneBorder font-light">|</span>
            <span className="text-xs uppercase font-mono tracking-widest text-brand-charcoalMuted hidden md:inline-block">
              AI Facial Skin Analysis
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/styleguide"
              className="text-xs font-medium text-brand-charcoalMuted hover:text-brand-charcoal transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-brand-terracotta" />
              <span>Style Guide</span>
            </Link>

            <Button
              variant="terracotta"
              size="sm"
              onClick={handleStartAnalysis}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="hidden sm:inline-flex shadow-soft-sm"
            >
              Begin Analysis
            </Button>
          </div>
        </div>
      </header>

      {/* Main Flow: Hero & Methodology */}
      <main className="flex-1">
        <LandingHero onStart={handleStartAnalysis} />
        <MethodologySection />

        {/* Pre-Capture Banner */}
        <section className="py-16 sm:py-24 bg-brand-bone border-t border-brand-stoneBorderSoft">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-6">
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-brand-terracotta">
              Private • Browser-Powered • Non-Invasive
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-brand-charcoal leading-tight">
              Ready to analyze your skin’s biological profile?
            </h2>
            <p className="text-sm sm:text-base text-brand-charcoalMuted font-light max-w-xl mx-auto leading-relaxed">
              Ensure you are in soft, indirect natural light and have your webcam accessible. The scan takes under a minute.
            </p>
            <div className="pt-2">
              <Button
                size="lg"
                variant="terracotta"
                onClick={handleStartAnalysis}
                rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                className="px-8 shadow-soft"
              >
                Launch Facial Scan
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-brand-stoneBorder/80 bg-brand-parchment/60 py-12 sm:py-16 text-xs text-brand-charcoalMuted">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-stoneBorderSoft pb-8">
            <div>
              <span className="font-serif text-xl tracking-wider text-brand-charcoal block">
                NEXZEN
              </span>
              <p className="text-xs text-brand-charcoalMuted font-light mt-1">
                Cosmetic-grade facial dermatology and formulation intelligence.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/styleguide" className="hover:text-brand-charcoal transition-colors">
                Design System
              </Link>
              <button
                onClick={handleStartAnalysis}
                className="hover:text-brand-charcoal transition-colors font-medium text-brand-terracotta"
              >
                Start Analysis
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="leading-relaxed font-light text-[11px] text-brand-charcoalMuted/80 max-w-4xl">
              <strong className="font-medium text-brand-charcoal">Cosmetic Guidance Notice:</strong> Nexzen is an educational and cosmetic assessment application designed for personalized skincare discovery and product formulation guidance. It does not provide medical diagnosis, clinical treatment plans, or pathology screening. Always seek the advice of a board-certified dermatologist for medical skin conditions.
            </p>
            <p className="text-[11px] font-mono text-brand-charcoalMuted/70">
              © {new Date().getFullYear()} Nexzen Cosmetics Lab. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
