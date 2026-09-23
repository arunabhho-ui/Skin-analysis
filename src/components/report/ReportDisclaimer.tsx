"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ReportDisclaimerProps {
  onStartOver: () => void;
}

export function ReportDisclaimer({ onStartOver }: ReportDisclaimerProps) {
  return (
    <div className="space-y-8 pt-4">
      {/* Start Over Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-brand-parchment/60 border border-brand-stoneBorder/80">
        <div>
          <h3 className="font-serif text-2xl text-brand-charcoal font-normal">
            Ready to perform another scan?
          </h3>
          <p className="text-xs text-brand-charcoalMuted font-light mt-0.5">
            Test alternative lighting conditions or calibrate a new user profile.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="terracotta"
            size="md"
            onClick={onStartOver}
            leftIcon={<RotateCcw className="w-4 h-4" />}
            className="shadow-soft"
          >
            Start New Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}
