"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAnalysis } from "@/context/AnalysisContext";
import { PhotoMaskOverlay } from "@/components/report/PhotoMaskOverlay";
import { MetricsBreakdown } from "@/components/report/MetricsBreakdown";
import { RecommendationsSection } from "@/components/report/RecommendationsSection";
import { ReportDisclaimer } from "@/components/report/ReportDisclaimer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RotateCcw, Download, ArrowLeft } from "lucide-react";
import { jsPDF } from "jspdf";

export default function ReportPage() {
  const router = useRouter();
  const { analysisResult, capturedImage, isHydrated, resetSession } = useAnalysis();

  useEffect(() => {
    if (isHydrated && !analysisResult) {
      router.replace("/capture");
    }
  }, [analysisResult, isHydrated, router]);

  // Active overlay layer toggles
  const [activeConcerns, setActiveConcerns] = useState<Record<string, boolean>>({});
  const [hoveredConcernId, setHoveredConcernId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const concernKey = useMemo(
    () => analysisResult?.concerns.map((c) => c.id).join("|") ?? "",
    [analysisResult?.concerns]
  );

  // Initialize all concern layers as active when a new report loads
  useEffect(() => {
    if (!analysisResult?.concerns?.length) return;

    const nextState: Record<string, boolean> = {};
    analysisResult.concerns.forEach((c) => {
      nextState[c.id] = true;
    });

    setActiveConcerns((prev) => {
      const prevKeys = Object.keys(prev).sort().join("|");
      const nextKeys = Object.keys(nextState).sort().join("|");

      if (prevKeys === nextKeys) {
        return prev;
      }

      return nextState;
    });
  }, [concernKey, analysisResult]);

  const handleToggleConcern = (id: string) => {
    setActiveConcerns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSetAll = (active: boolean) => {
    const updated: Record<string, boolean> = {};
    analysisResult?.concerns.forEach((c) => {
      updated[c.id] = active;
    });
    setActiveConcerns(updated);
  };

  const handleStartOver = () => {
    resetSession();
    router.push("/capture");
  };

  if (!isHydrated || !analysisResult || !capturedImage) {
    return (
      <main className="min-h-screen bg-brand-bone flex items-center justify-center text-sm text-brand-charcoalMuted">
        Loading analysis...
      </main>
    );
  }

  const report = analysisResult;
  const photoUrl = capturedImage;

  const handleDownloadPdf = async () => {
    setIsDownloading(true);

    // Let the loading state paint before generating the document.
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 48;
      const contentWidth = pageWidth - margin * 2;
      const colors = {
        bone: [247, 243, 237] as [number, number, number],
        parchment: [239, 232, 221] as [number, number, number],
        charcoal: [42, 40, 37] as [number, number, number],
        muted: [111, 104, 97] as [number, number, number],
        terracotta: [196, 125, 104] as [number, number, number],
        border: [218, 208, 196] as [number, number, number],
      };
      let y = margin;

      const addPageBackground = () => {
        pdf.setFillColor(...colors.bone);
        pdf.rect(0, 0, pageWidth, pageHeight, "F");
        pdf.setDrawColor(...colors.border);
        pdf.setLineWidth(0.6);
        pdf.line(margin, pageHeight - 32, pageWidth - margin, pageHeight - 32);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(...colors.muted);
        pdf.text("NEXZEN  /  CLINICAL DERMAL REPORT", margin, pageHeight - 18);
      };

      const addNewPage = () => {
        pdf.addPage();
        addPageBackground();
        y = margin;
      };

      const ensureSpace = (height: number) => {
        if (y + height > pageHeight - 48) addNewPage();
      };

      const addSectionTitle = (eyebrow: string, title: string) => {
        ensureSpace(62);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...colors.terracotta);
        pdf.text(eyebrow.toUpperCase(), margin, y);
        y += 19;
        pdf.setFont("times", "normal");
        pdf.setFontSize(21);
        pdf.setTextColor(...colors.charcoal);
        pdf.text(title, margin, y);
        y += 13;
        pdf.setDrawColor(...colors.border);
        pdf.setLineWidth(0.7);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 25;
      };

      const addParagraph = (text: string, width = contentWidth, size = 9, color = colors.muted) => {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(size);
        pdf.setTextColor(...color);
        const lines = pdf.splitTextToSize(text, width) as string[];
        ensureSpace(lines.length * (size + 4) + 4);
        pdf.text(lines, margin, y, { lineHeightFactor: 1.45 });
        y += lines.length * (size + 4) + 9;
      };

      const addLabelValue = (label: string, value: string, x: number, valueX: number, width: number) => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...colors.muted);
        pdf.text(label.toUpperCase(), x, y);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(...colors.charcoal);
        const lines = pdf.splitTextToSize(value, width) as string[];
        pdf.text(lines, valueX, y, { lineHeightFactor: 1.35 });
      };

      addPageBackground();
      pdf.setFont("times", "normal");
      pdf.setFontSize(28);
      pdf.setTextColor(...colors.charcoal);
      pdf.text("NEXZEN", margin, y + 2);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(...colors.terracotta);
      pdf.text("BIOMETRIC MORPHOMETRY", pageWidth - margin, y, { align: "right" });
      y += 30;
      pdf.setFont("times", "normal");
      pdf.setFontSize(23);
      pdf.setTextColor(...colors.charcoal);
      pdf.text("Facial Skin Analysis", margin, y);
      y += 31;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(...colors.muted);
      pdf.text("Structured diagnostic synthesis and formulation directives", margin, y);
      y += 28;

      const imageFormat = photoUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
      const imageProps = pdf.getImageProperties(photoUrl);
      const imageBoxWidth = 224;
      const imageBoxHeight = 270;
      const imageScale = Math.min(imageBoxWidth / imageProps.width, imageBoxHeight / imageProps.height);
      const imageWidth = imageProps.width * imageScale;
      const imageHeight = imageProps.height * imageScale;
      const heroTop = y;
      const imageX = margin + (imageBoxWidth - imageWidth) / 2;
      const imageY = heroTop + (imageBoxHeight - imageHeight) / 2;
      pdf.setFillColor(...colors.parchment);
      pdf.roundedRect(margin, heroTop, imageBoxWidth, imageBoxHeight, 8, 8, "F");
      pdf.addImage(photoUrl, imageFormat, imageX, imageY, imageWidth, imageHeight);

      const summaryX = margin + imageBoxWidth + 30;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(...colors.terracotta);
      pdf.text("PRIMARY CLASSIFICATION", summaryX, heroTop + 16);
      pdf.setFont("times", "normal");
      pdf.setFontSize(25);
      pdf.setTextColor(...colors.charcoal);
      pdf.text(`${report.skinType.label} complexion`, summaryX, heroTop + 45);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(...colors.muted);
      pdf.text(`${Math.round(report.skinType.confidence * 100)}% model confidence`, summaryX, heroTop + 65);
      pdf.setDrawColor(...colors.border);
      pdf.line(summaryX, heroTop + 82, pageWidth - margin, heroTop + 82);
      y = heroTop + 108;
      addLabelValue("Concern signals", `${report.concerns.length} identified`, summaryX, summaryX + 96, 92);
      y = heroTop + imageBoxHeight + 16;
      addLabelValue("Face mask", report.faceMask?.regions.length ? "Generated and applied" : "Unavailable", margin, margin + 86, 145);
      addLabelValue("Generated", report.timestamp ? new Date(report.timestamp).toLocaleDateString() : "Current session", margin + 258, margin + 328, 120);
      y += 38;

      addSectionTitle("01 / Skin profile", "Primary skin type");
      addParagraph(
        `The trained classifier identified a ${report.skinType.label} complexion with ${(
          report.skinType.confidence * 100
        ).toFixed(1)}% confidence. This classification is derived from the captured portrait and the EfficientNet-V2-S model.`
      );

      addSectionTitle("02 / Morphological signals", "Detected concerns");
      if (report.concerns.length === 0) {
        addParagraph("No condition masks exceeded the model threshold for this captured image.");
      } else {
        for (const concern of report.concerns) {
          ensureSpace(56);
          pdf.setFillColor(...colors.parchment);
          pdf.roundedRect(margin, y - 14, contentWidth, 44, 6, 6, "F");
          pdf.setFillColor(concern.color);
          pdf.circle(margin + 15, y + 8, 4, "F");
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(10);
          pdf.setTextColor(...colors.charcoal);
          pdf.text(concern.label, margin + 29, y + 5);
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9);
          pdf.setTextColor(...colors.muted);
          pdf.text(`${Math.round(concern.confidence * 100)}% confidence  /  ${concern.mask.regions.length} detected zone${concern.mask.regions.length === 1 ? "" : "s"}`, margin + 29, y + 21);
          y += 56;
        }
      }

      addSectionTitle("03 / Structural integrity", "Aging signals");
      if (report.aging.length === 0) {
        addParagraph("No aging signals were returned by the analysis pipeline.");
      } else {
        for (const signal of report.aging) {
          ensureSpace(27);
          addLabelValue(signal.label, `${Math.round(signal.confidence * 100)}% confidence`, margin, margin + 125, 150);
          y += 30;
        }
      }

      addSectionTitle("04 / Formulation directives", "Recommended actives");
      if (report.recommendations.length === 0) {
        addParagraph("No formulation recommendations were generated for this report.");
      } else {
        for (const recommendation of report.recommendations) {
          ensureSpace(70);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(11);
          pdf.setTextColor(...colors.charcoal);
          pdf.text(recommendation.ingredient, margin, y);
          y += 15;
          addParagraph(recommendation.rationale, contentWidth, 9, colors.muted);
          y += 7;
        }
      }

      ensureSpace(52);
      pdf.setDrawColor(...colors.border);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 18;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(...colors.muted);
      const footer = pdf.splitTextToSize(
        "This report summarizes a cosmetic image analysis and is intended for educational skincare guidance. It is not a medical diagnosis or a substitute for professional care.",
        contentWidth
      ) as string[];
      pdf.text(footer, margin, y, { lineHeightFactor: 1.4 });
      pdf.save("Skin Analysis Report.pdf");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bone text-brand-charcoal flex flex-col justify-between selection:bg-brand-terracotta-soft selection:text-brand-terracotta-dark">
      {/* Top Sticky Navigation */}
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
              Clinical Dermal Report
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleStartOver}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              New Analysis
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadPdf}
              isLoading={isDownloading}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              {isDownloading ? "Preparing PDF..." : "Download PDF"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Report Body */}
      <main className="max-w-5xl mx-auto px-6 sm:px-8 py-10 sm:py-16 w-full flex-1 space-y-16">
        {/* Report Editorial Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-brand-terracotta">
              Biometric Morphometry
            </span>
            <span className="text-brand-stoneBorder">•</span>
            <span className="text-[11px] font-mono text-brand-charcoalMuted">
              Calibrated Diagnostic Synthesis
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-brand-charcoal tracking-tight leading-[1.08]">
            Facial Skin Analysis & Formulation Directives
          </h1>

          <p className="text-sm sm:text-base text-brand-charcoalMuted font-light leading-relaxed">
            Optical evaluation of epidermal texture, barrier integrity, and micro-pore topology.
            Examine the localized condition masks below or review recommended active formulations.
          </p>
        </div>

        {/* SECTION 1: Centerpiece Photo with Interactive Mask Overlays & Toggle Legend */}
        <section className="space-y-4">
          <PhotoMaskOverlay
            imageSrc={photoUrl}
            concerns={report.concerns}
            activeConcerns={activeConcerns}
            onToggleConcern={handleToggleConcern}
            onSetAll={handleSetAll}
            hoveredConcernId={hoveredConcernId}
            faceMask={report.faceMask}
          />
        </section>

        {/* SECTION 2: Dermal Breakdown (Skin Type, Concerns, Aging) */}
        <section className="space-y-6 pt-4">
          <div className="border-b border-brand-stoneBorderSoft pb-4">
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-charcoal font-normal">
              Morphological Profile Breakdown
            </h2>
            <p className="text-xs text-brand-charcoalMuted font-light mt-1">
              Hierarchical diagnostic breakdown derived from multi-spectral optical evaluation.
            </p>
          </div>

          <MetricsBreakdown
            report={report}
            activeConcerns={activeConcerns}
            onToggleConcern={handleToggleConcern}
            onHoverConcern={setHoveredConcernId}
          />
        </section>

        {/* SECTION 3: Evidence-Based Active Recommendations */}
        <section className="pt-4">
          <RecommendationsSection recommendations={report.recommendations} />
        </section>

        {/* SECTION 4: Disclaimer & Start Over */}
        <section className="pt-6">
          <ReportDisclaimer onStartOver={handleStartOver} />
        </section>
      </main>

      {/* Subdued Editorial Footer */}
      <footer className="border-t border-brand-stoneBorder/80 bg-brand-parchment/60 py-10 text-xs text-brand-charcoalMuted">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-serif text-lg tracking-wider text-brand-charcoal">
            NEXZEN
          </span>
          <p className="font-light text-[11px] text-brand-charcoalMuted/80 text-center sm:text-right">
            Cosmetic Skin Analysis Prototype • Phase 5 Report Centerpiece
          </p>
        </div>
      </footer>
    </div>
  );
}
