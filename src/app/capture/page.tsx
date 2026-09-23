"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAnalysis } from "@/context/AnalysisContext";
import { CameraCapture } from "@/components/camera/CameraCapture";
import { PhotoPreview } from "@/components/camera/PhotoPreview";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";

export default function CapturePage() {
  const router = useRouter();
  const { capturedImage, setCapturedImage, setAnalysisResult, retake } = useAnalysis();

  const handleCapture = (imageDataUrl: string) => {
    setAnalysisResult(null);
    setCapturedImage(imageDataUrl);
  };

  const handleRetake = () => {
    retake();
  };

  const handleConfirmPhoto = () => {
    router.push("/analyzing");
  };

  return (
    <div className="min-h-screen bg-brand-bone text-brand-charcoal flex flex-col justify-between selection:bg-brand-terracotta-soft selection:text-brand-terracotta-dark">
      {/* Header */}
      <header className="border-b border-brand-stoneBorder/70 bg-brand-bone/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-18 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-medium text-brand-charcoalMuted hover:text-brand-charcoal transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Overview</span>
          </Link>

          <span className="font-serif text-2xl tracking-[0.08em] text-brand-charcoal font-normal">
            NEXZEN
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-brand-terracotta font-semibold">
              Step 1 of 3
            </span>
            <span className="text-xs text-brand-stoneBorder">|</span>
            <span className="text-xs text-brand-charcoalMuted hidden sm:inline-block">
              Optical Capture
            </span>
          </div>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <main className="max-w-3xl mx-auto px-6 py-8 sm:py-12 w-full flex-1 flex flex-col items-center justify-center">
        <div className="w-full text-center space-y-2 mb-6">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta">
            {capturedImage ? "Review Optical Capture" : "Calibrated Optical Studio"}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-normal">
            {capturedImage
              ? "Confirm Portrait Quality"
              : "Position Face Within The Calibrated Guide"}
          </h1>
          <p className="text-xs sm:text-sm text-brand-charcoalMuted font-light max-w-md mx-auto leading-relaxed">
            {capturedImage
              ? "Verify facial illumination and clarity before proceeding to diagnostic lipid & pore indexing."
              : "Hold steady in soft, natural lighting. The optical sensor will automatically record the portrait once balanced."}
          </p>
        </div>

        {/* Dynamic Display: Live Camera Feed OR Captured Photo Preview */}
        {capturedImage ? (
          <PhotoPreview
            imageSrc={capturedImage}
            onRetake={handleRetake}
            onConfirm={handleConfirmPhoto}
          />
        ) : (
          <CameraCapture onCapture={handleCapture} />
        )}
      </main>

      {/* Subdued Footer */}
      <footer className="border-t border-brand-stoneBorderSoft py-6 text-center text-xs text-brand-charcoalMuted">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-light text-[11px]">
            Nexzen Optical Diagnostic Protocol • Private client-side execution
          </span>
          <span className="text-[11px] font-mono text-brand-charcoalMuted/70">
            Phase 3: Camera Capture Flow
          </span>
        </div>
      </footer>
    </div>
  );
}
