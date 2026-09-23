"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { RotateCcw, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

interface PhotoPreviewProps {
  imageSrc: string;
  onRetake: () => void;
  onConfirm: () => void;
}

export function PhotoPreview({ imageSrc, onRetake, onConfirm }: PhotoPreviewProps) {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center space-y-6 animate-fade-in">
      {/* Captured Image Container */}
      <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden bg-brand-charcoal border border-brand-stoneBorder shadow-soft-lg">
        {/* The captured image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt="Captured face portrait"
          className="w-full h-full object-cover"
        />

        {/* Floating status tag */}
        <div className="absolute top-4 left-4 bg-brand-bone/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-brand-stoneBorder/80 text-xs shadow-soft-sm flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-medium text-brand-charcoal">Calibrated Portrait Ready</span>
        </div>

        {/* Subtle decorative studio overlay marks */}
        <div className="absolute inset-0 pointer-events-none border border-white/20 rounded-3xl" />
      </div>

      {/* Confirmation & Retake Controls */}
      <Card padding="md" className="w-full bg-white/90 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-brand-stoneBorderSoft pb-3">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-brand-terracotta font-semibold">
              Exposure Quality
            </span>
            <p className="text-xs text-brand-charcoal font-medium mt-0.5">
              Balanced ambient illumination & facial alignment confirmed
            </p>
          </div>
          <Badge variant="terracotta" size="sm">Optimal</Badge>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <Button
            variant="secondary"
            size="md"
            onClick={onRetake}
            leftIcon={<RotateCcw className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Retake Photo
          </Button>

          <Button
            variant="terracotta"
            size="md"
            onClick={onConfirm}
            rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
            className="w-full sm:w-auto px-6 shadow-soft"
          >
            Use This Photo & Analyze
          </Button>
        </div>
      </Card>
    </div>
  );
}
