"use client";

import React from "react";
import { RecommendationItem } from "@/types/analysis";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, FlaskConical, Clock, ShieldCheck, ArrowUpRight } from "lucide-react";

interface RecommendationsSectionProps {
  recommendations: RecommendationItem[];
}

export function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  // Routine timing suggestions for authentic skincare realism
  const getRoutineTiming = (ingredient: string) => {
    const lower = ingredient.toLowerCase();
    if (lower.includes("retinoid")) return "Evening application only • Follow with barrier cream";
    if (lower.includes("salicylic")) return "2–3 evenings per week • Apply after gentle cleansing";
    if (lower.includes("benzoyl")) return "Morning or evening on targeted areas";
    if (lower.includes("ceramide")) return "Morning & evening daily";
    return "Morning & evening daily • Layer before heavier creams";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-brand-stoneBorderSoft pb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-terracotta block">
            04 / Prescriptive Actives
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-normal mt-0.5">
            Evidence-Based Formulations
          </h2>
        </div>
        <p className="text-xs text-brand-charcoalMuted font-light max-w-sm">
          Ingredients curated from published dermatological literature corresponding to your scan findings.
        </p>
      </div>

      {/* Grid of Formulation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {recommendations.map((item, idx) => (
          <Card
            key={idx}
            padding="md"
            className="bg-[#FAF7F2] border-brand-stoneBorder/90 shadow-soft-sm hover:shadow-soft flex flex-col justify-between space-y-5 transition-all duration-300 group"
          >
            <div className="space-y-3.5">
              {/* Card Meta Header */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-widest text-brand-terracotta font-semibold flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5" />
                  Prescribed Active No. 0{idx + 1}
                </span>
                <Badge variant="outline" size="sm">Evidence Grade A</Badge>
              </div>

              {/* Ingredient Name */}
              <h3 className="font-serif text-2xl sm:text-3xl text-brand-charcoal font-normal group-hover:text-brand-terracotta-dark transition-colors leading-snug">
                {item.ingredient}
              </h3>

              {/* Exact One-Line Rationale from Contract */}
              <p className="text-xs sm:text-sm text-brand-charcoalSoft font-light leading-relaxed">
                {item.rationale}
              </p>
            </div>

            {/* Application Guidance Footer */}
            <div className="pt-3 border-t border-brand-stoneBorderSoft flex items-center justify-between text-xs text-brand-charcoalMuted">
              <div className="flex items-center gap-1.5 font-light text-[11px]">
                <Clock className="w-3.5 h-3.5 text-brand-terracotta" />
                <span>{getRoutineTiming(item.ingredient)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
