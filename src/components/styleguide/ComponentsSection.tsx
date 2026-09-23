"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SeverityIndicator } from "@/components/ui/SeverityIndicator";
import { OverlayLegendChip } from "@/components/ui/OverlayLegendChip";
import { Camera, Sparkles, ArrowRight, RotateCcw } from "lucide-react";

export function ComponentsSection() {
  const [sliderVal, setSliderVal] = useState(74);
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    pores: true,
    wrinkles: true,
    acne: false,
    blackheads: true,
  });

  const toggleLayer = (key: string) => {
    setActiveLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      {/* Buttons Showcase */}
      <Card padding="md">
        <CardHeader>
          <CardTitle className="text-xl">Buttons & Interactive Triggers</CardTitle>
          <CardDescription>Restrained tactile weights, quiet hover transitions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Begin Analysis
            </Button>
            <Button variant="terracotta" leftIcon={<Camera className="w-4 h-4" />}>
              Capture Scan
            </Button>
            <Button variant="secondary" leftIcon={<RotateCcw className="w-4 h-4" />}>
              Retake Photo
            </Button>
            <Button variant="outline">
              Review Methodology
            </Button>
            <Button variant="ghost">
              Dismiss
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-brand-stoneBorderSoft">
            <Button size="sm" variant="terracotta">Small CTA</Button>
            <Button size="md" variant="terracotta">Standard CTA</Button>
            <Button size="lg" variant="terracotta">Generous CTA</Button>
            <Button size="md" variant="primary" isLoading>Processing</Button>
          </div>
        </CardContent>
      </Card>

      {/* Severity Indicators & Metrics */}
      <Card padding="md">
        <CardHeader>
          <CardTitle className="text-xl">Severity Indicators & Scales</CardTitle>
          <CardDescription>
            Subtle, non-clinical metric visualization — 3px hairline rule & discrete 5-pip dots
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Interactive slider tester */}
          <div className="flex items-center gap-4 bg-brand-bone/80 p-4 rounded-xl border border-brand-stoneBorder/60">
            <span className="text-xs font-medium text-brand-charcoalMuted uppercase tracking-wider min-w-[120px]">
              Adjust Value: <strong className="text-brand-charcoal font-mono">{sliderVal}%</strong>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderVal}
              onChange={(e) => setSliderVal(Number(e.target.value))}
              className="w-full accent-brand-terracotta cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-charcoalMuted block">
                Hairline Continuous Bar
              </span>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-brand-charcoal mb-1">
                    <span>Enlarged Pores (T-Zone)</span>
                    <span className="font-mono text-brand-charcoalMuted">88%</span>
                  </div>
                  <SeverityIndicator value={88} color="#C98B72" />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-brand-charcoal mb-1">
                    <span>Micro-Wrinkles (Periorbital)</span>
                    <span className="font-mono text-brand-charcoalMuted">34%</span>
                  </div>
                  <SeverityIndicator value={34} color="#8E8276" />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-brand-charcoal mb-1">
                    <span>Dynamic Live Value</span>
                    <span className="font-mono text-brand-charcoalMuted">{sliderVal}%</span>
                  </div>
                  <SeverityIndicator value={sliderVal} color="#C47D68" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-charcoalMuted block">
                Discrete 5-Pip Minimalist Scale
              </span>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-brand-charcoal">Sebum Hyper-secretion</span>
                  <SeverityIndicator type="dots" value={91} color="#C47D68" showPercent />
                </div>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-brand-charcoal">Erythema / Irritation</span>
                  <SeverityIndicator type="dots" value={42} color="#C36F65" showPercent />
                </div>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-brand-charcoal">Dynamic Live Value</span>
                  <SeverityIndicator type="dots" value={sliderVal} color="#1D1C1A" showPercent />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges & Overlay Legend Chips */}
      <Card padding="md">
        <CardHeader>
          <CardTitle className="text-xl">Condition Badges & Mask Toggle Chips</CardTitle>
          <CardDescription>Interactive filter controls for the facial mask overlay visualizer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-charcoalMuted block">
              Dermatological Badges
            </span>
            <div className="flex flex-wrap gap-2">
              <Badge variant="terracotta">Oily Complexion (91%)</Badge>
              <Badge variant="neutral">Combination Profile</Badge>
              <Badge variant="dark">Grade II Analysis</Badge>
              <Badge variant="outline">Non-Comedogenic</Badge>
              <Badge variant="concern" dotColor="#C98B72">Pores Region</Badge>
              <Badge variant="concern" dotColor="#C36F65">Active Acne</Badge>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-brand-stoneBorderSoft">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-charcoalMuted block">
              Mask Overlay Layer Controls (Click to toggle)
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              <OverlayLegendChip
                label="Enlarged Pores"
                color="#C98B72"
                active={activeLayers.pores}
                count={3}
                onClick={() => toggleLayer("pores")}
              />
              <OverlayLegendChip
                label="Fine Lines & Wrinkles"
                color="#8E8276"
                active={activeLayers.wrinkles}
                count={2}
                onClick={() => toggleLayer("wrinkles")}
              />
              <OverlayLegendChip
                label="Inflammatory Acne"
                color="#C36F65"
                active={activeLayers.acne}
                count={1}
                onClick={() => toggleLayer("acne")}
              />
              <OverlayLegendChip
                label="Comedones (Blackheads)"
                color="#5F7065"
                active={activeLayers.blackheads}
                count={4}
                onClick={() => toggleLayer("blackheads")}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
