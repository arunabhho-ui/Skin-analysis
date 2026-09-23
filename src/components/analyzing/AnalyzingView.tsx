"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAnalysis } from "@/context/AnalysisContext";
import { Card } from "@/components/ui/Card";
import { Sparkles, Check, Scan, Layers, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
  {
    step: "01",
    label: "Epidermal Barrier & Sebum Normalization",
    subtext: "Calibrating optical exposure, surface luminance, and skin tone baseline...",
    icon: Scan,
  },
  {
    step: "02",
    label: "Follicular Pore & Morphological Indexing",
    subtext: "Detecting localized comedones, pore volume, and periorbital micro-creases...",
    icon: Layers,
  },
  {
    step: "03",
    label: "Active Ingredient Literature Synthesis",
    subtext: "Formulating peer-reviewed ingredient concentrations for barrier repair...",
    icon: FlaskConical,
  },
];

export function AnalyzingView() {
  const router = useRouter();
  const { capturedImage, runAnalysis } = useAnalysis();

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [analysisReady, setAnalysisReady] = useState(false);
  const hasTriggeredAnalysis = useRef(false);

  // Run the analysis and drive the multi-stage visual progression
  useEffect(() => {
    let isCancelled = false;

    if (!capturedImage) {
      router.replace("/capture");
      return () => {
        isCancelled = true;
      };
    }

    // Trigger the analyzeFace contract call in background
    if (!hasTriggeredAnalysis.current) {
      hasTriggeredAnalysis.current = true;
      runAnalysis(capturedImage)
        .then(() => setAnalysisReady(true))
        .catch((err) => console.error("Analysis execution error:", err));
    }

    // Paced animation timeline (~3.8 seconds total duration)
    const startTime = performance.now();
    const totalDuration = 3800; // ms

    const timer = setInterval(() => {
      if (isCancelled) return;
      const elapsed = performance.now() - startTime;
      const currentProgress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      setProgress(currentProgress);

      if (currentProgress < 38) {
        setCurrentStageIndex(0);
      } else if (currentProgress < 75) {
        setCurrentStageIndex(1);
      } else {
        setCurrentStageIndex(2);
      }

      if (elapsed >= totalDuration) {
        clearInterval(timer);
        setIsComplete(true);

      }
    }, 40);

    return () => {
      isCancelled = true;
      clearInterval(timer);
    };
  }, [capturedImage, runAnalysis, router]);

  useEffect(() => {
    if (!isComplete || !analysisReady) return;

    const timeout = setTimeout(() => {
      router.push("/report");
    }, 600);

    return () => clearTimeout(timeout);
  }, [analysisReady, isComplete, router]);

  const currentStage = STAGES[currentStageIndex];
  const CurrentIcon = currentStage.icon;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center space-y-8 animate-fade-in">
      {/* Visual Centerpiece: Face Portrait with Soft Optical Scan Beam */}
      <div className="relative w-56 sm:w-64 aspect-[3/4] rounded-3xl overflow-hidden bg-brand-charcoal border border-brand-stoneBorder shadow-soft-lg">
        {capturedImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capturedImage}
            alt="Facial scan in progress"
            className="w-full h-full object-cover filter contrast-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-parchment text-brand-charcoalMuted">
            <Scan className="w-12 h-12 text-brand-terracotta/60 animate-subtle-pulse" />
          </div>
        )}

        {/* Soft Warm Scanning Beam (Not harsh sci-fi, warm editorial glow) */}
        {!isComplete && (
          <div
            className="absolute inset-x-0 h-16 pointer-events-none transition-transform duration-75"
            style={{
              top: `${(progress % 100)}%`,
              transform: "translateY(-50%)",
            }}
          >
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-brand-terracotta to-transparent opacity-85" />
            <div className="w-full h-full bg-gradient-to-b from-brand-terracotta/20 via-brand-terracotta/5 to-transparent blur-sm" />
          </div>
        )}

        {/* Ambient Overlay Vignette */}
        <div className="absolute inset-0 border border-white/20 rounded-3xl pointer-events-none" />

        {/* Corner alignment marks */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-brand-terracotta/60" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-brand-terracotta/60" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-brand-terracotta/60" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-brand-terracotta/60" />
      </div>

      {/* Narrative Progress Card */}
      <Card padding="md" className="w-full bg-white/90 shadow-soft space-y-6">
        {/* Stage Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-terracotta-soft text-brand-terracotta flex items-center justify-center flex-shrink-0 mt-0.5">
              {isComplete ? (
                <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              ) : (
                <CurrentIcon className="w-4 h-4 stroke-[1.5] animate-pulse" />
              )}
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-brand-terracotta font-semibold">
                Phase {currentStage.step} of 03
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-brand-charcoal font-normal mt-0.5">
                {isComplete ? "Dermal Analysis Complete" : currentStage.label}
              </h3>
            </div>
          </div>

          <span className="text-sm font-mono text-brand-charcoalMuted tabular-nums">
            {progress}%
          </span>
        </div>

        {/* Refined 3px Hairline Progress Line */}
        <div className="space-y-2">
          <div className="w-full h-[3px] bg-brand-stoneBorderSoft rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-terracotta rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-brand-charcoalMuted font-light leading-relaxed">
            {isComplete
              ? "Synthesis finalized. Compiling full diagnostic report and tailored formulations..."
              : currentStage.subtext}
          </p>
        </div>

        {/* Three Step Micro-Timeline */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-brand-stoneBorderSoft">
          {STAGES.map((s, idx) => {
            const isDone = currentStageIndex > idx || isComplete;
            const isCurrent = currentStageIndex === idx && !isComplete;
            return (
              <div key={s.step} className="flex flex-col space-y-1">
                <div
                  className={cn(
                    "h-1 rounded-full transition-colors duration-300",
                    isDone
                      ? "bg-brand-terracotta"
                      : isCurrent
                      ? "bg-brand-terracotta/40 animate-pulse"
                      : "bg-brand-stoneBorderSoft"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-mono",
                    isDone || isCurrent ? "text-brand-charcoal" : "text-brand-charcoalMuted/60"
                  )}
                >
                  Step {s.step}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
