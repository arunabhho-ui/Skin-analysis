"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CameraOff, Upload, RotateCcw, ShieldCheck } from "lucide-react";

interface CameraPermissionDeniedProps {
  onRetry: () => void;
  onPhotoSelected: (dataUrl: string) => void;
  errorMessage?: string;
}

export function CameraPermissionDenied({
  onRetry,
  onPhotoSelected,
  errorMessage,
}: CameraPermissionDeniedProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onPhotoSelected(result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card padding="lg" className="max-w-lg mx-auto text-center space-y-6 bg-white/90 shadow-soft-lg">
      <div className="w-16 h-16 rounded-2xl bg-brand-terracotta-soft text-brand-terracotta flex items-center justify-center mx-auto shadow-soft-sm">
        <CameraOff className="w-8 h-8 stroke-[1.5]" />
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-terracotta">
          Camera Access Required
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-brand-charcoal font-normal">
          Optical Sensor Unavailable
        </h2>
        <p className="text-sm text-brand-charcoalMuted font-light leading-relaxed max-w-sm mx-auto">
          {errorMessage ||
            "Please enable camera permissions in your browser address bar to proceed with the optical scan. Your video feed is processed 100% locally and never leaves your browser."}
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          variant="terracotta"
          size="md"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          Try Again
        </Button>

        <Button
          variant="secondary"
          size="md"
          onClick={() => fileInputRef.current?.click()}
          leftIcon={<Upload className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          Upload Portrait Photo
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      <div className="pt-4 border-t border-brand-stoneBorderSoft flex items-center justify-center gap-2 text-xs text-brand-charcoalMuted">
        <ShieldCheck className="w-4 h-4 text-emerald-600/80" />
        <span>Privacy guaranteed: Image is processed client-side</span>
      </div>
    </Card>
  );
}
