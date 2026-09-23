"use client";

import React from "react";
import Link from "next/link";
import { AnalyzingView } from "@/components/analyzing/AnalyzingView";
import { ArrowLeft } from "lucide-react";

export default function AnalyzingPage() {
  return (
    <div className="min-h-screen bg-brand-bone text-brand-charcoal flex flex-col justify-between selection:bg-brand-terracotta-soft selection:text-brand-terracotta-dark">
      {/* Header */}
      <header className="border-b border-brand-stoneBorder/70 bg-brand-bone/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-18 py-4 flex items-center justify-between">
          <Link
            href="/capture"
            className="text-xs font-medium text-brand-charcoalMuted hover:text-brand-charcoal transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retake Capture</span>
          </Link>

          <span className="font-serif text-2xl tracking-[0.08em] text-brand-charcoal font-normal">
            NEXZEN
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-brand-terracotta font-semibold">
              Step 2 of 3
            </span>
            <span className="text-xs text-brand-stoneBorder">|</span>
            <span className="text-xs text-brand-charcoalMuted hidden sm:inline-block">
              Model Inference
            </span>
          </div>
        </div>
      </header>

      {/* Main Analysis Body */}
      <main className="max-w-3xl mx-auto px-6 py-10 sm:py-16 w-full flex-1 flex flex-col items-center justify-center">
        <div className="w-full text-center space-y-2 mb-8">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta">
            Algorithmic Biometrics
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-normal">
            Analyzing Facial Morphometry
          </h1>
          <p className="text-xs sm:text-sm text-brand-charcoalMuted font-light max-w-md mx-auto leading-relaxed">
            Please remain on this screen while optical feature vectors are processed through the cosmetic classification model.
          </p>
        </div>

        <AnalyzingView />
      </main>

      {/* Subdued Footer */}
      <footer className="border-t border-brand-stoneBorderSoft py-6 text-center text-xs text-brand-charcoalMuted">
        <p className="font-light text-[11px]">
          Phase 4: Optical Processing & Model Synthesis • Private client-side execution
        </p>
      </footer>
    </div>
  );
}
